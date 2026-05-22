import crypto from 'node:crypto';

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value)).digest('hex')}`;
}

export class PipelineState {
  constructor({ input, createdAt = new Date().toISOString() }) {
    this.input = input;
    this.created_at = createdAt;
    this.stages = [];
  }

  recordStage({ stage, status, payload = null, error = null }) {
    const serialized = payload ? JSON.stringify(payload) : '';
    const stageHash = sha256(`${stage}|${status}|${serialized}|${error || ''}`);
    this.stages.push({
      stage,
      status,
      at: new Date().toISOString(),
      hash: stageHash,
      payload,
      error,
    });
    return stageHash;
  }

  summary() {
    const failed = this.stages.find((s) => s.status === 'failed');
    return {
      input: this.input,
      created_at: this.created_at,
      stage_count: this.stages.length,
      failed: Boolean(failed),
      failed_stage: failed?.stage || null,
      pipeline_hash: sha256(JSON.stringify(this.stages.map((s) => ({ stage: s.stage, status: s.status, hash: s.hash })))),
    };
  }
}

export { sha256 };
