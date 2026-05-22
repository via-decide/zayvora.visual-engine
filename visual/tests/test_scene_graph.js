import test from 'node:test';
import assert from 'node:assert/strict';
import { SceneGraphBuilder } from '../scene_graph.js';

test('scene graph hashing is deterministic', () => {
  const build = () => {
    const builder = new SceneGraphBuilder();
    builder.addScene({ scene_id: 'SCENE-001', duration_frames: 120, layers: [] });
    builder.addTextNode('SCENE-001', 'LAYER-TITLE', 'Why APIs Fail at Scale', { x: 120, y: 160 }, {}, {});
    return builder.hashSceneGraph();
  };
  assert.equal(build(), build());
});
