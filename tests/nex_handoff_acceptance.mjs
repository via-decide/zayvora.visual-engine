import assert from 'node:assert/strict';
import { createNexVisualHandoff } from '../integrations/nex_visual_handoff_contract.js';
import { runNexResearchHandoffPipeline } from '../pipeline/visual_pipeline.js';

const cases = [
  ['Why do APIs fail at scale?', 'Systems failure narrative', ['Latency compounds through dependency chains.', 'Queues saturate shared resources.', 'Retries can amplify cascading failure.']],
  ['How does a heat exchanger transfer energy?', 'Technical explanatory narrative', ['Temperature difference drives heat flow.', 'Conductive surfaces transfer energy between fluids.', 'Flow arrangement changes transfer efficiency.']],
  ['Why does local-first software change digital ownership?', 'Conceptual argument narrative', ['Local data keeps work available under user control.', 'Sync coordinates replicas rather than owning the source of truth.', 'Portability changes bargaining power with platforms.']],
];

const signatures = new Set();
for (const [question, focus, claims] of cases) {
  const handoff = createNexVisualHandoff({
    research_id: `research-${question.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: question.replace(/\?$/, ''),
    original_question: question,
    executive_summary: `${focus}: Nex verified ${claims.length} claims for visual interpretation.`,
    verified_findings: claims.map((claim, index) => ({ finding_id: `F${index + 1}`, claim, finding_confidence: index === 2 ? 'LIKELY' : 'VERIFIED', evidence_ids: [`E${index + 1}`] })),
    concept_relationships: [{ from: 'F1', to: 'F2', relationship: 'causal sequence' }],
    evidence_items: claims.map((claim, index) => ({ evidence_id: `E${index + 1}`, source_id: `S${index + 1}`, text: claim })),
    source_references: claims.map((claim, index) => ({ source_id: `S${index + 1}`, title: `Source ${index + 1}`, url: `https://example.com/${index + 1}` })),
    visual_objective: focus,
    audience: 'general technical audience',
    artifact_type: 'slide_artifact',
  });
  const result = runNexResearchHandoffPipeline(handoff);
  assert.equal(result.status, 'success');
  assert.ok(result.handoff_id);
  assert.equal(result.intent.entry_type, 'nex_research_handoff');
  assert.ok(result.narrative.beats.length >= claims.length + 3);
  assert.ok(result.slide_specification.slides.every((slide) => Array.isArray(slide.claim_ids)));
  assert.ok(result.artifact.complete);
  assert.ok(result.artifact.slides.length > 0);
  signatures.add(result.narrative.beats.map((beat) => `${beat.role}:${beat.message}`).join('|'));
  console.log(JSON.stringify({ question, focus, findings: handoff.verified_findings.map((f) => ({ id: f.finding_id, confidence: f.finding_confidence })), handoff: handoff.handoff_id, intent: result.intent.communication_objective, narrative: result.narrative.beats.map((b) => b.role), slide_count: result.artifact.slide_count, artifact: result.artifact.artifact_hash }));
}
assert.equal(signatures.size, cases.length);
