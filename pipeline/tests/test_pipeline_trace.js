import test from 'node:test';
import assert from 'node:assert/strict';
import { PipelineTraceLogger } from '../pipeline_trace_logger.js';

test('captures timestamped trace events', () => {
  const logger = new PipelineTraceLogger();
  logger.log('stage_a', { ok: true });
  logger.log('stage_b', { ok: false });

  const trace = logger.export();
  assert.equal(trace.event_count, 2);
  assert.equal(trace.events[0].stage, 'stage_a');
  assert.ok(trace.events[0].at);
});
