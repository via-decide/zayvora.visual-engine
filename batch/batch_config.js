export const DEFAULT_BATCH_CONFIG = {
  max_parallel: 4,
  retry_attempts: 2,
  deterministic_retry_delay_ms: 0,
};

export function resolveBatchConfig(overrides = {}) {
  return {
    ...DEFAULT_BATCH_CONFIG,
    ...overrides,
  };
}
