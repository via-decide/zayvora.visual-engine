import test from 'node:test';
import assert from 'node:assert/strict';
import { promptToSceneGraph } from '../prompt_to_scene.js';
import { sceneGraphToTimeline, validateTimeline } from '../scene_to_timeline.js';

test('scene graph converts to valid frame timeline', () => {
  const graph = promptToSceneGraph('A\nB', { request_id: 'VISUAL-001' });
  const timeline = sceneGraphToTimeline(graph, { scene_duration_frames: 120, fps: 30 });
  assert.equal(timeline.total_frames, 240);
  assert.equal(validateTimeline(timeline), true);
});
