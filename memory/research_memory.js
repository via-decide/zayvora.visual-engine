import { SourceCache } from './source_cache.js';
import { TopicIndex } from './topic_index.js';
import { CitationMemory } from './citation_memory.js';
import { ReusePolicy } from './reuse_policy.js';

export class ResearchMemory {
  constructor({ sourceCache = new SourceCache(), topicIndex = new TopicIndex(), citationMemory = new CitationMemory(), reusePolicy = new ReusePolicy() } = {}) {
    this.sourceCache = sourceCache;
    this.topicIndex = topicIndex;
    this.citationMemory = citationMemory;
    this.reusePolicy = reusePolicy;
  }

  rememberResearch({ topic, sources = [], citations = [] }) {
    for (const source of sources) {
      const entry = this.sourceCache.put(source);
      this.topicIndex.add(topic, entry.content_hash);
    }

    for (const row of citations) {
      if (row.claim_text) this.citationMemory.remember({ claim: row.claim_text, citationRow: row });
    }
  }

  getReusableSources({ topic, verificationReport, now = new Date(), videoId = '' }) {
    const hashes = new Set();
    this.topicIndex.hashesForTopic(topic).forEach((h) => hashes.add(h));
    for (const rel of this.topicIndex.related(topic)) {
      this.topicIndex.hashesForTopic(rel.topic).forEach((h) => hashes.add(h));
    }

    const reusable = [];
    const refresh = [];
    for (const hash of hashes) {
      const entry = this.sourceCache.getByHash(hash);
      if (!entry) continue;
      const stale = this.sourceCache.isStale(entry, now);
      const decision = this.reusePolicy.shouldReuse({ cacheEntry: entry, isStale: stale, verificationReport });
      if (decision.reuse) {
        this.sourceCache.markReused(hash, { topic, videoId, reusedAt: now.toISOString() });
        reusable.push(this.sourceCache.getByHash(hash));
      } else if (decision.reason === 'stale_source_refresh_required') {
        refresh.push(entry);
      }
    }

    return { reusable, refresh };
  }

  reuseCitationsForClaim(claimText) {
    return this.citationMemory.reuseForClaim(claimText);
  }
}
