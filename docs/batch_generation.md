# Batch Video Generation System

The batch pipeline runs 10–100+ deterministic research-to-video jobs safely.

## Modules

- `batch/batch_config.js` — reproducible batch configuration defaults.
- `batch/batch_job.js` — deterministic job objects and finalization.
- `batch/batch_queue.js` — queue + status tracking (`queued`, `running`, `succeeded`, `failed`).
- `batch/batch_runner.js` — bulk orchestration, deterministic retries, output manifesting.

## Capabilities

- Accepts list inputs (`topic`, `url`, `doc_title`, or full `nex_output`).
- Runs full notebook replacement pipeline per input.
- Tracks status for every job and overall queue snapshot.
- Stores per-job outputs and hashes.
- Retries failed jobs with deterministic attempt boundaries.

## Determinism + parallel safety

- Jobs have stable `job_id` and deterministic keys.
- Retry limits are fixed from config (`retry_attempts`).
- Output manifest includes deterministic `batch_hash`.
- Queue state is explicit and replayable for auditing.
