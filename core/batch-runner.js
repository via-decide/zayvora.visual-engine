'use strict';

const { stableHash } = require('./variation-engine');

function runBatch(plan, kup = defaultKUPExecutor) {
  if (!plan || !Array.isArray(plan.batches)) {
    throw new Error('Invalid execution plan');
  }

  const results = [];
  for (const batch of plan.batches) {
    for (const item of batch.items) {
      const result = kup(item, plan.constraints);
      results.push(result);
    }
  }

  return results;
}

function defaultKUPExecutor(item, constraints) {
  const payload = `${item.variation.base_prompt}|${JSON.stringify(item.variation.config)}|${constraints.resolution}`;
  const imageToken = stableHash(`image:${payload}`);
  const latency = computeDeterministicLatency(payload, constraints.latency_bound_ms);
  const success = latency <= constraints.latency_bound_ms;

  return {
    id: item.runId,
    config: item.variation.config,
    image: `image://${imageToken}@${constraints.resolution}`,
    latency,
    success
  };
}

function computeDeterministicLatency(payload, bound) {
  const hashNum = parseInt(stableHash(`latency:${payload}`), 16);
  const baseline = Math.max(50, Math.floor(bound * 0.55));
  const spread = Math.max(1, Math.floor(bound * 0.45));
  return baseline + (hashNum % spread);
}

module.exports = {
  runBatch,
  defaultKUPExecutor
};
