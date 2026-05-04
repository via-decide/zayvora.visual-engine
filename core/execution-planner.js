'use strict';

function planExecution(variations, options = {}) {
  if (!Array.isArray(variations) || variations.length === 0) {
    throw new Error('variations must be a non-empty array');
  }

  const constraints = variations[0].constraints || {};
  const batchSize = Math.max(1, Math.floor(options.batchSize || Math.min(4, constraints.max_images || 12)));
  validateExecutionSafety(variations, constraints, batchSize);

  const batches = [];
  for (let i = 0; i < variations.length; i += batchSize) {
    const items = variations.slice(i, i + batchSize).map((variation, idx) => ({
      runId: `${variation.id}_run_${String(i + idx + 1).padStart(2, '0')}`,
      sequence: i + idx,
      variation
    }));
    batches.push({ batchId: `batch_${String(batches.length + 1).padStart(2, '0')}`, items });
  }

  return { batchSize, constraints, batches, totalRuns: variations.length };
}

function validateExecutionSafety(variations, constraints, batchSize) {
  const resolution = Number(constraints.resolution || 1024);
  const maxImages = Number(constraints.max_images || 12);
  const latencyBound = Number(constraints.latency_bound_ms || 3000);

  if (variations.length > maxImages) {
    throw new Error(`Constraint violation: batch overload (${variations.length} > max_images ${maxImages})`);
  }

  if (batchSize > maxImages) {
    throw new Error(`Constraint violation: batch_size ${batchSize} exceeds max_images ${maxImages}`);
  }

  const bytesPerImage = resolution * resolution * 4;
  const estimatedMemory = bytesPerImage * batchSize;
  const memoryBound = 512 * 1024 * 1024;
  if (estimatedMemory > memoryBound) {
    throw new Error(`Constraint violation: estimated memory ${estimatedMemory} exceeds ${memoryBound}`);
  }

  if (latencyBound < 100) {
    throw new Error('Constraint violation: latency bound too small for safe scheduling');
  }
}

module.exports = {
  planExecution,
  validateExecutionSafety
};
