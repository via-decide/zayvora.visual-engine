import { sha256Hash } from '../visual/visual_hash.js';

export class PipelineStateManager {
  constructor(request_id = 'PIPELINE-REQ-001') {
    this.state = {
      request_id,
      stages: {},
      stage_order: [],
      deterministic: true,
    };
  }

  setStage(stage, payload) {
    this.state.stages[stage] = {
      payload,
      hash: sha256Hash(payload),
      valid: true,
    };
    if (!this.state.stage_order.includes(stage)) {
      this.state.stage_order.push(stage);
    }
    return this.state.stages[stage];
  }

  setStageValidation(stage, valid, reason = '') {
    if (!this.state.stages[stage]) {
      this.state.stages[stage] = { payload: null, hash: null, valid: false };
      this.state.stage_order.push(stage);
    }
    this.state.stages[stage].valid = valid;
    this.state.stages[stage].reason = reason;
  }

  getState() {
    const snapshot = { ...this.state };
    snapshot.state_hash = sha256Hash(snapshot);
    return snapshot;
  }
}
