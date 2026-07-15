import { sha256Hash } from '../visual/visual_hash.js';

const SUPPORTED_CONFIDENCE = new Set(['VERIFIED', 'LIKELY']);
const SUPPORTED_SCHEMA_VERSION = '1.0.0';

function requireString(value, code) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(code);
  return value.trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeFinding(finding, index) {
  const finding_id = requireString(finding.finding_id ?? finding.id, `MISSING_FINDING_ID:${index}`);
  const claim = requireString(finding.claim ?? finding.summary ?? finding.text, `MISSING_FINDING_CLAIM:${finding_id}`);
  const confidence = requireString(finding.finding_confidence ?? finding.confidence, `MISSING_FINDING_CONFIDENCE:${finding_id}`).toUpperCase();
  if (!SUPPORTED_CONFIDENCE.has(confidence)) throw new Error(`UNSUPPORTED_FINDING_CONFIDENCE:${finding_id}`);
  const evidence_ids = asArray(finding.evidence_ids ?? finding.evidence).map((item) => typeof item === 'string' ? item : item.evidence_id).filter(Boolean);
  if (evidence_ids.length === 0) throw new Error(`MISSING_FINDING_EVIDENCE:${finding_id}`);
  return { finding_id, claim, finding_confidence: confidence, evidence_ids };
}

function normalizeSourceReference(source, index) {
  const source_id = requireString(source.source_id ?? source.id, `MISSING_SOURCE_ID:${index}`);
  return { source_id, title: source.title ?? source.name ?? source_id, url: source.url ?? null, excerpt: source.excerpt ?? source.quote ?? null };
}

function normalizeEvidence(evidence, index) {
  const evidence_id = requireString(evidence.evidence_id ?? evidence.id, `MISSING_EVIDENCE_ID:${index}`);
  const source_id = requireString(evidence.source_id ?? evidence.source, `MISSING_EVIDENCE_SOURCE:${evidence_id}`);
  return { evidence_id, source_id, text: evidence.text ?? evidence.excerpt ?? '' };
}

export function createNexVisualHandoff(input = {}) {
  if (input.schema_version && input.schema_version !== SUPPORTED_SCHEMA_VERSION) throw new Error(`UNSUPPORTED_NEX_HANDOFF_VERSION:${input.schema_version}`);
  const verified_findings = asArray(input.verified_findings).map(normalizeFinding);
  if (verified_findings.length === 0) throw new Error('NO_FINDINGS_EXIST');
  const source_references = asArray(input.source_references).map(normalizeSourceReference);
  const evidence_items = asArray(input.evidence_items ?? input.evidence).map(normalizeEvidence);
  const findingIds = new Set();
  for (const finding of verified_findings) {
    if (findingIds.has(finding.finding_id)) throw new Error(`DUPLICATE_FINDING_ID:${finding.finding_id}`);
    findingIds.add(finding.finding_id);
  }
  const evidenceIds = new Set();
  for (const evidence of evidence_items) {
    if (evidenceIds.has(evidence.evidence_id)) throw new Error(`DUPLICATE_EVIDENCE_ID:${evidence.evidence_id}`);
    evidenceIds.add(evidence.evidence_id);
  }
  const sourceIds = new Set();
  for (const source of source_references) {
    if (sourceIds.has(source.source_id)) throw new Error(`DUPLICATE_SOURCE_ID:${source.source_id}`);
    sourceIds.add(source.source_id);
  }
  const evidenceById = new Set(evidence_items.map((item) => item.evidence_id));
  for (const finding of verified_findings) {
    for (const evidenceId of finding.evidence_ids) {
      if (!evidenceById.has(evidenceId)) throw new Error(`UNRESOLVED_EVIDENCE:${finding.finding_id}:${evidenceId}`);
    }
  }
  const handoff = {
    contract_type: 'nex.visual_handoff',
    schema_version: '1.0.0',
    research_id: requireString(input.research_id, 'MISSING_RESEARCH_ID'),
    title: requireString(input.title, 'MISSING_TITLE'),
    original_question: requireString(input.original_question, 'MISSING_ORIGINAL_QUESTION'),
    executive_summary: requireString(input.executive_summary, 'MISSING_EXECUTIVE_SUMMARY'),
    verified_findings,
    concept_relationships: asArray(input.concept_relationships),
    evidence_items,
    source_references,
    visual_objective: requireString(input.visual_objective, 'MISSING_VISUAL_OBJECTIVE'),
    audience: requireString(input.audience, 'MISSING_AUDIENCE'),
    artifact_type: requireString(input.artifact_type, 'MISSING_ARTIFACT_TYPE'),
    selected_finding_id: input.selected_finding_id ?? null,
  };
  if (handoff.selected_finding_id && !verified_findings.some((finding) => finding.finding_id === handoff.selected_finding_id)) throw new Error('SELECTED_FINDING_CANNOT_BE_RESOLVED');
  handoff.handoff_id = `NEX-HANDOFF-${sha256Hash(handoff).slice(7, 15).toUpperCase()}`;
  return handoff;
}

export function selectHandoffFindings(handoff) {
  if (!Array.isArray(handoff?.verified_findings) || handoff.verified_findings.length === 0) throw new Error('HANDOFF_CONTAINS_ZERO_SUPPORTED_CLAIMS');
  if (!handoff.selected_finding_id) return handoff.verified_findings;
  const selected = handoff.verified_findings.find((finding) => finding.finding_id === handoff.selected_finding_id);
  if (!selected) throw new Error('SELECTED_FINDING_CANNOT_BE_RESOLVED');
  return [selected];
}
