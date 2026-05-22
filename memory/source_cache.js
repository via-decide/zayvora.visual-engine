export class SourceCache {
  constructor({ staleAfterDays = 30 } = {}) {
    this.staleAfterDays = staleAfterDays;
    this.byHash = new Map();
    this.bySourceId = new Map();
  }

  put(resource) {
    if (!resource?.content_hash) {
      throw new Error('content_hash is required for source cache entry.');
    }
    const entry = {
      ...resource,
      cached_at: resource.cached_at || new Date().toISOString(),
      reuse_count: resource.reuse_count || 0,
      last_reused_at: resource.last_reused_at || null,
      reuse_history: resource.reuse_history || [],
    };
    this.byHash.set(entry.content_hash, entry);
    if (entry.source_id) this.bySourceId.set(entry.source_id, entry.content_hash);
    return entry;
  }

  getByHash(contentHash) {
    return this.byHash.get(contentHash) || null;
  }

  getBySourceId(sourceId) {
    const hash = this.bySourceId.get(sourceId);
    return hash ? this.byHash.get(hash) || null : null;
  }

  markReused(contentHash, context = {}) {
    const entry = this.byHash.get(contentHash);
    if (!entry) return null;
    entry.reuse_count += 1;
    entry.last_reused_at = context.reusedAt || new Date().toISOString();
    entry.reuse_history.push({
      topic: context.topic || '',
      video_id: context.videoId || '',
      reused_at: entry.last_reused_at,
    });
    this.byHash.set(contentHash, entry);
    return entry;
  }

  isStale(entry, now = new Date()) {
    const publishedAt = entry?.published_at || entry?.publishedAt;
    if (!publishedAt) return true;
    const published = new Date(publishedAt);
    if (Number.isNaN(published.getTime())) return true;
    const ageDays = (now.getTime() - published.getTime()) / (24 * 60 * 60 * 1000);
    return ageDays > this.staleAfterDays;
  }

  list() {
    return [...this.byHash.values()];
  }
}
