import test from 'node:test';
import assert from 'node:assert/strict';
import { promptToSceneGraph } from '../prompt_to_scene.js';

test('prompt to scene graph generates deterministic scene graph', () => {
  const prompt = 'Why APIs fail at scale\nLatency\nResilience';
  const graph = promptToSceneGraph(prompt, { max_scenes: 3, request_id: 'VISUAL-001' });
  assert.equal(Array.isArray(graph.scenes), true);
  assert.equal(graph.scenes.length, 3);
  assert.equal(graph.scenes[0].scene_id, 'SCENE-001');
});
