import test from 'node:test';
import assert from 'node:assert/strict';
import { IngestionManifest } from '../ingestion_manifest.js';

test('manifest hash is deterministic', () => {
  const payload = {
    runId: 'run-1',
    createdAt: '2026-05-22T00:00:00.000Z',
    resources: [{ source_id: 'SRC-1', text: 'abc' }],
    errors: [],
  };

  const one = new IngestionManifest(payload);
  const two = new IngestionManifest(payload);

  assert.equal(one.manifestHash, two.manifestHash);
  assert.equal(one.toJSON().resourceCount, 1);
});
