import { sha256Hash } from '../visual/visual_hash.js';

export function createBatchJob(input, index) {
  const request_id = input.request_id ?? `BATCH-REQ-${String(index + 1).padStart(4, '0')}`;
  return {
    job_id: `JOB-${String(index + 1).padStart(5, '0')}`,
    request_id,
    input,
    status: 'queued',
    attempts: 0,
    max_attempts: 1,
    result: null,
    error: null,
    deterministic_key: sha256Hash({ request_id, input }),
  };
}

export function finalizeJob(job, status, payload = {}) {
  return {
    ...job,
    status,
    ...payload,
  };
}
