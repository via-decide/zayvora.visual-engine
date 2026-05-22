import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveActiveScene } from '../Composition.js';

test('scene rendering selects correct scene by frame', () => {
  const timeline = { segments: [
    { scene_id: 'A', start_frame: 0, duration_frames: 100 },
    { scene_id: 'B', start_frame: 100, duration_frames: 100 },
  ]};
  assert.equal(resolveActiveScene(timeline, 42).scene_id, 'A');
  assert.equal(resolveActiveScene(timeline, 142).scene_id, 'B');
});
