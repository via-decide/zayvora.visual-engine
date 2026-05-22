export class CitationTableBuilder {
  build(mappedClaims = []) {
    const rows = [];
    for (const claim of mappedClaims) {
      for (const entry of claim.evidence || []) {
        rows.push({
          claim_id: claim.claim_id,
          source_id: entry.source_id,
          url: entry.url || '',
          excerpts: (entry.excerpts || []).slice(0, 3),
          verified: claim.verified,
          confidence: claim.confidence,
        });
      }
      if (!claim.evidence?.length) {
        rows.push({
          claim_id: claim.claim_id,
          source_id: null,
          url: '',
          excerpts: [],
          verified: false,
          confidence: claim.confidence,
        });
      }
    }
    return rows;
  }
}
