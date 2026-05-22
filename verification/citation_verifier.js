export class CitationVerifier {
  verify(citations = [], ingestedSources = []) {
    const sourceIds = new Set((ingestedSources || []).map((s) => s.source_id));
    const invalid = [];
    let validCount = 0;

    for (const row of citations || []) {
      if (!row?.source_id) {
        invalid.push({ claim_id: row?.claim_id || null, source_id: null, reason: 'missing_source_id' });
        continue;
      }
      if (!sourceIds.has(row.source_id)) {
        invalid.push({ claim_id: row.claim_id, source_id: row.source_id, reason: 'source_not_ingested' });
        continue;
      }
      validCount += 1;
    }

    const total = (citations || []).length;
    const coverage = total === 0 ? 0 : Number((validCount / total).toFixed(2));
    return { invalid, coverage, validCount, total };
  }
}
