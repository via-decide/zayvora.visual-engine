export class SourceCardGenerator {
  build(citationRows = []) {
    const cards = new Map();
    for (const row of citationRows) {
      if (!row.source_id) continue;
      if (!cards.has(row.source_id)) {
        cards.set(row.source_id, {
          source_id: row.source_id,
          url: row.url,
          claims: [],
          excerpt_preview: row.excerpts?.[0] || '',
          verified_claims: 0,
        });
      }
      const card = cards.get(row.source_id);
      card.claims.push(row.claim_id);
      if (row.verified) card.verified_claims += 1;
    }
    return [...cards.values()];
  }
}
