export function normalizeNexResearch(parsed) {
  const normalizedClaims = (parsed.claims ?? []).map((claim, index) => ({
    claim_id: claim.claim_id ?? `CLAIM-${String(index + 1).padStart(3, '0')}`,
    text: claim.text ?? String(claim),
    section: claim.section ?? 'general',
    citations: Array.isArray(claim.citations) ? claim.citations : [],
  }));

  const normalizedSections = (parsed.sections ?? []).map((section, index) => ({
    section_id: section.section_id ?? `SECTION-${String(index + 1).padStart(3, '0')}`,
    heading: section.heading ?? section.title ?? `Section ${index + 1}`,
    beats: Array.isArray(section.beats) ? section.beats : [],
  }));

  return {
    request_id: parsed.request_id,
    title: parsed.title || 'Nex Research Summary',
    claims: normalizedClaims,
    sections: normalizedSections,
    sources: parsed.sources ?? [],
  };
}

export function claimsToVideoBeats(normalized) {
  if ((normalized.sections ?? []).length > 0) {
    return normalized.sections.map((section, index) => ({
      beat_id: `BEAT-${String(index + 1).padStart(3, '0')}`,
      title: section.heading,
      narrative: section.beats.join(' ') || section.heading,
      citations: normalized.claims
        .filter((claim) => claim.section === section.heading || claim.section === section.section_id)
        .flatMap((claim) => claim.citations),
    }));
  }

  return normalized.claims.map((claim, index) => ({
    beat_id: `BEAT-${String(index + 1).padStart(3, '0')}`,
    title: claim.section,
    narrative: claim.text,
    citations: claim.citations,
  }));
}
