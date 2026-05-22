export class SourceCoverageChecker {
  check(ingestedSources = [], options = {}) {
    const minSources = options.minSources ?? 2;
    const weakSources = [];

    if ((ingestedSources || []).length < minSources) {
      weakSources.push({ reason: 'insufficient_source_count', expected: minSources, actual: ingestedSources.length });
    }

    for (const src of ingestedSources || []) {
      const words = String(src.text || '').trim().split(/\s+/).filter(Boolean).length;
      if (words < (options.minWordsPerSource ?? 40)) {
        weakSources.push({ source_id: src.source_id, reason: 'low_content_density', words });
      }
    }

    return weakSources;
  }
}
