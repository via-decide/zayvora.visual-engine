import test from 'node:test';
import assert from 'node:assert/strict';
import { ResearchMemory } from '../research_memory.js';

test('reuses non-stale sources and returns stale ones for refresh', () => {
  const memory = new ResearchMemory();

  memory.rememberResearch({
    topic: 'AI coding copilots',
    sources: [
      { source_id: 'SRC-FRESH', content_hash: 'sha256:fresh', published_at: '2026-05-20T00:00:00.000Z', text: 'fresh source content' },
      { source_id: 'SRC-OLD', content_hash: 'sha256:old', published_at: '2024-01-01T00:00:00.000Z', text: 'old source content' },
    ],
    citations: [
      { claim_text: 'Copilots reduce boilerplate coding.', source_id: 'SRC-FRESH' },
    ],
  });

  const result = memory.getReusableSources({
    topic: 'AI copilots for software teams',
    verificationReport: { ready_for_video: true, citation_coverage: 1.0 },
    now: new Date('2026-05-22T00:00:00.000Z'),
    videoId: 'VID-22',
  });

  assert.equal(result.reusable.length, 1);
  assert.equal(result.reusable[0].source_id, 'SRC-FRESH');
  assert.equal(result.refresh.length, 1);
  assert.equal(result.refresh[0].source_id, 'SRC-OLD');

  const reusedCitations = memory.reuseCitationsForClaim('Copilots reduce boilerplate coding.');
  assert.equal(reusedCitations.length, 1);
});
