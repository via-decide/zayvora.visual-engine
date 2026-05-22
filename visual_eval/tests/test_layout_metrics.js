import test from 'node:test';
import assert from 'node:assert/strict';
import { detectOverflow, scoreViewportFit } from '../layout_metrics.js';

test('layout overflow is detected for out-of-viewport layer', () => {
  const sceneGraph = {
    scenes: [{ scene_id: 'SCENE-001', layers: [{ layer_id: 'L1', type: 'text', position: { x: 1900, y: 1000 }, dimensions: { width: 200, height: 200 } }] }],
  };
  const overflow = detectOverflow(sceneGraph, { width: 1920, height: 1080 });
  assert.equal(overflow.length, 1);
  assert.equal(scoreViewportFit(sceneGraph, { width: 1920, height: 1080 }) < 1, true);
});
