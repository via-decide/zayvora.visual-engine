import test from 'node:test';
import assert from 'node:assert/strict';
import { VisualEvaluator } from '../visual_evaluator.js';

test('visual evaluator returns deterministic scores and snapshot hash stability', () => {
  const evaluator = new VisualEvaluator();
  const sceneGraph = {
    scenes: [{ scene_id: 'SCENE-001', layers: [{ layer_id: 'T1', type: 'text', position: { x: 120, y: 120 }, dimensions: { width: 400, height: 80 }, style: { fontSize: 24 } }] }],
  };
  const timeline = {
    segments: [{ scene_id: 'SCENE-001', start_frame: 0, duration_frames: 120 }],
    transitions: [],
    keyframes: [{ track_id: 'SCENE-001:T1', frame: 0, value: { opacity: 1 } }],
  };
  const contract = { request_id: 'VISUAL-001', render_hash: 'sha256:r', timeline_hash: 'sha256:t', scene_graph_hash: 'sha256:s' };
  const assets = { assets: [{ asset_id: 'A1', hash: 'sha256:a', usage: ['SCENE-001'] }] };
  const frameModel = { frame: 10, scene_id: 'SCENE-001' };

  const sceneResult = evaluator.evaluateSceneGraph(sceneGraph);
  const timelineResult = evaluator.evaluateTimeline(timeline);
  const contractResult = evaluator.evaluateRenderContract(contract);
  const assetResult = evaluator.evaluateAssetManifest(assets);
  const frameResult = evaluator.evaluateFrameDeterminism(frameModel, frameModel);
  const overall = evaluator.calculateOverallScore({ sceneResult, timelineResult, contractResult, assetResult, frameResult });

  assert.equal(sceneResult.valid, true);
  assert.equal(timelineResult.valid, true);
  assert.equal(contractResult.valid, true);
  assert.equal(assetResult.valid, true);
  assert.equal(frameResult.valid, true);
  assert.equal(overall > 0.9, true);
});
