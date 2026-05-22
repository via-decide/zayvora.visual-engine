import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceRanker } from '../source_ranker.js';

test('ranks authoritative and relevant sources higher', () => {
  const ranker = new SourceRanker();
  const now = new Date('2026-05-22T00:00:00.000Z');

  const ranked = ranker.rank([
    { title: 'Personal blog opinion', snippet: 'hot take', sourceType: 'articles', publishedAt: '2023-01-01', authoritySignals: { domainAuthority: 10 } },
    { title: 'Official Kubernetes Documentation', snippet: 'kubernetes deployment guide', sourceType: 'documentation', publishedAt: '2026-05-20', authoritySignals: { domainAuthority: 88 } },
  ], 'kubernetes deployment', { now });

  assert.equal(ranked[0].sourceType, 'documentation');
  assert.ok(ranked[0].scores.total > ranked[1].scores.total);
});
