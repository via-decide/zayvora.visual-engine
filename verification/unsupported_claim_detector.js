export class UnsupportedClaimDetector {
  detect(talkingPoints = [], sectionEvidence = []) {
    const evidenceByClaim = new Map(
      (sectionEvidence || [])
        .filter((row) => row?.claim_id)
        .map((row) => [row.claim_id, row.evidence]),
    );

    return (talkingPoints || [])
      .filter((point) => point?.claim_id)
      .filter((point) => {
        if (point.verified === false) return true;
        const evidence = evidenceByClaim.get(point.claim_id);
        if (!evidence) return true;
        const excerpts = evidence.excerpts || [];
        return !Array.isArray(excerpts) || excerpts.length === 0;
      })
      .map((point) => ({
        claim_id: point.claim_id,
        talking_point: point.talking_point,
        reason: 'missing_or_unverified_evidence',
      }));
  }
}
