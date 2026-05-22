import test from 'node:test';
import assert from 'node:assert/strict';
import { runBatchGeneration } from '../batch/batch_runner.js';

test('batch runner processes list inputs, tracks status, stores outputs, deterministic retries and hashes', () => {
  const inputs = [
    { request_id: 'BATCH-A', topic: 'API reliability patterns' },
    { request_id: 'BATCH-B', url: 'https://example.com/distributed-systems' },
    { request_id: 'BATCH-C', doc_title: 'Latency diagnosis guide' },
  ];

  const a = runBatchGeneration(inputs, { max_parallel: 2, retry_attempts: 1 });
  const b = runBatchGeneration(inputs, { max_parallel: 2, retry_attempts: 1 });

  assert.equal(a.queue.total, 3);
  assert.equal(a.queue.succeeded, 3);
  assert.equal(a.queue.failed, 0);
  assert.equal(Object.keys(a.manifest.outputs).length, 3);
  assert.equal(Boolean(a.manifest.batch_hash), true);
  assert.equal(a.manifest.batch_hash, b.manifest.batch_hash);
  assert.equal(a.queue.jobs[0].status, 'succeeded');
});
