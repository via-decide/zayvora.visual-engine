import test from 'node:test';
import assert from 'node:assert/strict';
import { VISUAL_REQUEST_SCHEMA, validateRequiredFields } from '../visual_schema.js';

test('visual request validation includes schema version', () => {
  const sample = {
    schema_version: '1.0.0', request_id: 'REQ-001', prompt: 'p', normalized_intent: 'intent', format: '16:9',
    duration: { frames: 1 }, dimensions: { width: 1, height: 1 }, scenes: [], timeline: {}, assets: {},
    render_hash: 'sha256:x', deterministic: true,
  };
  const result = validateRequiredFields(sample, VISUAL_REQUEST_SCHEMA);
  assert.equal(result.valid, true);
  assert.equal(sample.schema_version.length > 0, true);
});
