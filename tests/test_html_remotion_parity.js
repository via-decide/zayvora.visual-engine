import test from 'node:test';
import assert from 'node:assert/strict';
import { VisualGenerationEngine } from '../engine/visual_generation_engine.js';

test('html and remotion share the same scene graph hash', () => {
  const engine = new VisualGenerationEngine({ renderer: 'json' });
  const result = engine.generateFromPrompt('parity prompt', { target: 'json' });
  const html = engine.renderHTML(result.render_contract);
  const video = engine.renderVideo(result.render_contract, result.scene_graph, result.timeline);
  assert.equal(html.html.scene_graph_hash, result.render_contract.scene_graph_hash);
  assert.equal(video.remotion.contract_hash, result.render_contract.render_hash);
});
