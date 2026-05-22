import test from 'node:test';
import assert from 'node:assert/strict';
import { registerComposition } from '../Root.js';

test('composition mapping follows render contract dimensions/fps/duration', () => {
  const contract = { contract_id: 'RENDER-001', width: 1920, height: 1080, fps: 30, duration_frames: 900 };
  const composition = registerComposition(contract);
  assert.equal(composition.width, 1920);
  assert.equal(composition.height, 1080);
  assert.equal(composition.fps, 30);
  assert.equal(composition.durationInFrames, 900);
});
