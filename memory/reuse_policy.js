export class ReusePolicy {
  constructor({ minCitationCoverage = 0.8 } = {}) {
    this.minCitationCoverage = minCitationCoverage;
  }

  shouldReuse({ cacheEntry, isStale, verificationReport }) {
    if (!cacheEntry) return { reuse: false, reason: 'missing_cache_entry' };
    if (isStale) return { reuse: false, reason: 'stale_source_refresh_required' };
    if (!verificationReport?.ready_for_video) return { reuse: false, reason: 'verification_not_ready' };
    if ((verificationReport.citation_coverage ?? 0) < this.minCitationCoverage) {
      return { reuse: false, reason: 'insufficient_citation_coverage' };
    }
    return { reuse: true, reason: 'eligible_for_reuse' };
  }
}
