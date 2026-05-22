const PRIMARY_TYPES = new Set(['official_pages', 'documentation', 'papers', 'datasets', 'github_repos']);
const COMMENTARY_TYPES = new Set(['articles', 'transcripts']);

export class TrustPolicy {
  evaluate(source = {}) {
    const sourceType = source.sourceType || source.source_type || 'articles';
    const isPrimary = PRIMARY_TYPES.has(sourceType);
    const isCommentary = COMMENTARY_TYPES.has(sourceType);

    const sourceTypeScore = isPrimary ? 95 : isCommentary ? 58 : 50;
    const citationUsefulness = isPrimary ? 92 : 64;

    return {
      isPrimary,
      isCommentary,
      sourceTypeScore,
      citationUsefulness,
      policyLabel: isPrimary ? 'prefer' : 'secondary',
    };
  }
}
