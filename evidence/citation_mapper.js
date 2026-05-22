import { QuoteExtractor } from './quote_extractor.js';

function confidenceFromEvidence(evidenceCount, maxEvidence = 3) {
  const raw = Math.min(1, evidenceCount / maxEvidence);
  return Number(raw.toFixed(2));
}

export class CitationMapper {
  constructor({ quoteExtractor = new QuoteExtractor() } = {}) {
    this.quoteExtractor = quoteExtractor;
  }

  mapClaimsToEvidence(claims, resources) {
    return claims.map((claimRecord) => {
      const evidence = [];
      const sourceIds = new Set();

      for (const resource of resources) {
        const excerpts = this.quoteExtractor.extractEvidenceForClaim(claimRecord.claim, resource);
        if (!excerpts.length) continue;
        sourceIds.add(resource.source_id);
        evidence.push({
          source_id: resource.source_id,
          url: resource.url,
          excerpts,
        });
      }

      const confidence = confidenceFromEvidence(evidence.length);
      const verified = evidence.length > 0;

      return {
        claim_id: claimRecord.claim_id,
        claim: claimRecord.claim,
        source_ids: [...sourceIds],
        evidence,
        confidence,
        verified,
      };
    });
  }
}

export { confidenceFromEvidence };
