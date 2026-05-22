import { SearchProviderRegistry } from './search_provider_registry.js';
import { SourceCandidate } from './source_candidate.js';
import { SourceRanker } from './source_ranker.js';
import { SourceManifest } from './source_manifest.js';

function inferInputType(input) {
  if (typeof input !== 'string') return 'document';
  if (/^https?:\/\//i.test(input)) return 'url';
  if (input.length > 600 || input.includes('\n')) return 'document';
  if (input.includes('?')) return 'question';
  return 'topic';
}

export class SourceDiscoveryEngine {
  constructor({ registry = new SearchProviderRegistry(), ranker = new SourceRanker(), lowQualityThreshold = 55 } = {}) {
    this.registry = registry;
    this.ranker = ranker;
    this.lowQualityThreshold = lowQualityThreshold;
  }

  async discover(input, options = {}) {
    const inputType = inferInputType(input);
    const rawResults = await this.registry.queryAll(String(input), { inputType, ...options });

    const normalized = rawResults
      .map((item) => new SourceCandidate(item).toJSON())
      .filter((item) => item.url && item.title);

    const deduped = [...new Map(normalized.map((c) => [c.hash, c])).values()];
    const ranked = this.ranker.rank(deduped, String(input), { now: options.now });
    const accepted = ranked.filter((candidate) => !this.ranker.isLowQuality(candidate, this.lowQualityThreshold));

    return new SourceManifest({
      query: String(input),
      inputType,
      createdAt: options.createdAt || new Date().toISOString(),
      sources: accepted,
    });
  }
}
