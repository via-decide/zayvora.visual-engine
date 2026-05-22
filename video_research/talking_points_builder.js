export class TalkingPointsBuilder {
  build(brief = {}) {
    const claims = brief.key_claims || [];
    const points = claims.map((claim, index) => ({
      section: `Section ${index + 1}`,
      claim_id: claim.claim_id,
      talking_point: claim.claim,
      confidence: claim.confidence,
      verified: claim.verified,
      source_ids: claim.source_ids || [],
    }));

    if (brief.contradictions?.length) {
      points.push({
        section: 'Contradictions',
        claim_id: null,
        talking_point: `Address ${brief.contradictions.length} contradiction(s) and explain resolution path.`,
        confidence: 0.5,
        verified: false,
        source_ids: [],
      });
    }

    return points;
  }

  buildSectionEvidence(brief = {}) {
    const evidenceByClaim = new Map((brief.evidence_table || []).map((row) => [row.claim_id, row]));
    return (brief.key_claims || []).map((claim, index) => ({
      section: `Section ${index + 1}`,
      claim_id: claim.claim_id,
      evidence: evidenceByClaim.get(claim.claim_id) || null,
    }));
  }
}
