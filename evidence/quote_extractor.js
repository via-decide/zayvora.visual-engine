import { splitSentences } from './claim_extractor.js';

export class QuoteExtractor {
  extractEvidenceForClaim(claim, resource, options = {}) {
    const maxExcerpts = options.maxExcerpts || 3;
    const claimTokens = String(claim)
      .toLowerCase()
      .split(/\W+/)
      .filter((t) => t.length > 3);

    const excerpts = splitSentences(resource.text)
      .map((sentence) => {
        const lower = sentence.toLowerCase();
        const overlap = claimTokens.filter((token) => lower.includes(token)).length;
        return { sentence, overlap };
      })
      .filter((item) => item.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, maxExcerpts)
      .map((item) => item.sentence);

    return excerpts;
  }
}
