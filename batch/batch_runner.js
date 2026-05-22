import { resolveBatchConfig } from './batch_config.js';
import { createBatchJob, finalizeJob } from './batch_job.js';
import { BatchQueue } from './batch_queue.js';
import { runFullNotebookLmReplacementPipeline } from '../pipeline/full_video_pipeline.js';
import { sha256Hash } from '../visual/visual_hash.js';

function inputToPipelinePayload(input, index) {
  if (input.nex_output) return input;
  const title = input.topic ?? input.url ?? input.doc_title ?? `Topic ${index + 1}`;
  return {
    request_id: input.request_id ?? `BATCH-REQ-${String(index + 1).padStart(4, '0')}`,
    nex_output: {
      request_id: input.request_id ?? `BATCH-REQ-${String(index + 1).padStart(4, '0')}`,
      title,
      claims: [{ text: String(title), section: 'Overview', citations: [] }],
      sources: [],
      sections: [{ heading: 'Overview', beats: [String(title)] }],
    },
  };
}

export function runBatchGeneration(inputs = [], configOverrides = {}) {
  const config = resolveBatchConfig(configOverrides);
  const jobs = inputs.map((input, index) => {
    const job = createBatchJob(input, index);
    return { ...job, max_attempts: config.retry_attempts + 1 };
  });

  const queue = new BatchQueue(jobs);
  const outputs = {};

  while (queue.hasNext()) {
    let job = queue.next();
    if (!job) break;

    queue.update(job.job_id, { status: 'running' });

    while (job.attempts < job.max_attempts) {
      const attempts = job.attempts + 1;
      try {
        const payload = inputToPipelinePayload(job.input, Number(job.job_id.split('-')[1]) - 1);
        const result = runFullNotebookLmReplacementPipeline(payload);
        const output = {
          request_id: result.request_id,
          trace_hash: result.trace.trace_hash,
          state_hash: result.stages.state_hash,
          youtube_package_hash: result.stages.stages.youtube_package?.hash ?? sha256Hash(result.stages.stages.youtube_package),
          deterministic: true,
        };
        outputs[job.job_id] = output;
        const finalized = finalizeJob(job, 'succeeded', { attempts, result: output, error: null });
        queue.update(job.job_id, finalized);
        break;
      } catch (error) {
        const finalAttempt = attempts >= job.max_attempts;
        if (finalAttempt) {
          const finalized = finalizeJob(job, 'failed', {
            attempts,
            error: String(error?.message ?? error),
          });
          queue.update(job.job_id, finalized);
          break;
        }
        job = { ...job, attempts };
      }
    }
  }

  const snapshot = queue.snapshot();
  const manifest = {
    total_jobs: snapshot.total,
    succeeded: snapshot.succeeded,
    failed: snapshot.failed,
    outputs,
    deterministic: true,
  };
  manifest.batch_hash = sha256Hash(manifest);

  return {
    config,
    queue: snapshot,
    manifest,
  };
}
