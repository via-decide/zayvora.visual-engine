import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceManifest } from '../source_manifest.js';

test('produces deterministic manifest hash for same payload', () => {
  const input = {
    query: 'climate dataset sources',
    inputType: 'topic',
    createdAt: '2026-05-22T00:00:00.000Z',
    sources: [{ url: 'https://data.gov/example' }],
  };

  const one = new SourceManifest(input);
  const two = new SourceManifest(input);

  assert.equal(one.hash, two.hash);
  assert.equal(one.toJSON().sourceCount, 1);
});
