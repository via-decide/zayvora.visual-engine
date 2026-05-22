import { sha256Hash } from '../visual/visual_hash.js';

export function validateStagePayload(stage, payload) {
  if (payload === null || payload === undefined) {
    return { valid: false, reason: `${stage} payload missing` };
  }
  if (typeof payload === 'object' && Object.keys(payload).length === 0) {
    return { valid: false, reason: `${stage} payload empty` };
  }
  return { valid: true, reason: '' };
}

export function buildFullTrace(state) {
  const stages = state.stage_order.map((stage) => ({
    stage,
    hash: state.stages[stage]?.hash,
    valid: state.stages[stage]?.valid,
    reason: state.stages[stage]?.reason ?? '',
  }));

  const trace = {
    request_id: state.request_id,
    stages,
    deterministic: true,
  };
  trace.trace_hash = sha256Hash(trace);
  return trace;
}
