import test from 'node:test';
import assert from 'node:assert/strict';
import { frameContinuity } from '../timeline_metrics.js';

test('timeline continuity catches frame gap', () => {
  const timeline = {
    segments: [
      { scene_id: 'A', start_frame: 0, duration_frames: 100 },
      { scene_id: 'B', start_frame: 120, duration_frames: 100 },
    ],
  };
  const result = frameContinuity(timeline);
  assert.equal(result.valid, false);
  assert.equal(result.gaps, 1);
});
