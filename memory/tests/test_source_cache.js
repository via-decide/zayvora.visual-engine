import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceCache } from '../source_cache.js';

test('caches by hash, tracks reuse, and detects stale sources', () => {
  const cache = new SourceCache({ staleAfterDays: 30 });
  const entry = cache.put({
    source_id: 'SRC-1',
    content_hash: 'sha256:abc',
    published_at: '2026-05-01T00:00:00.000Z',
    text: 'content',
  });

  assert.equal(cache.getByHash('sha256:abc').source_id, 'SRC-1');
  assert.equal(cache.getBySourceId('SRC-1').content_hash, 'sha256:abc');

  cache.markReused('sha256:abc', { topic: 'ai copilots', videoId: 'VID-1', reusedAt: '2026-05-22T00:00:00.000Z' });
  const reused = cache.getByHash('sha256:abc');
  assert.equal(reused.reuse_count, 1);
  assert.equal(reused.reuse_history.length, 1);

  assert.equal(cache.isStale(entry, new Date('2026-05-22T00:00:00.000Z')), false);
  assert.equal(cache.isStale({ published_at: '2025-01-01T00:00:00.000Z' }, new Date('2026-05-22T00:00:00.000Z')), true);
});
