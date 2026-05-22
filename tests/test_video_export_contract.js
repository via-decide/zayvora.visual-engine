import test from 'node:test';
import assert from 'node:assert/strict';
import { POST as videoPost } from '../app/api/video/route.js';
import { VisualGenerationEngine } from '../engine/visual_generation_engine.js';

test('api video route returns deterministic render manifest and export includes hashes', async () => {
  const req = { json: async () => ({ prompt: 'video route prompt', target: 'remotion', format: 'mp4', width: 1920, height: 1080, fps: 30 }) };
  const response = await videoPost(req);
  const payload = await response.json();
  assert.equal(payload.deterministic, true);
  assert.equal(Boolean(payload.render_contract_hash), true);

  const engine = new VisualGenerationEngine({ renderer: 'remotion' });
  const run = engine.generateFromPrompt('video route prompt', { target: 'remotion' });
  const exportResult = engine.exportArtifacts(run.request_id, run.render_contract, run.output_manifest, [run.output.output_path ?? 'outputs/video.mp4']);
  assert.equal(Boolean(exportResult.export_hash), true);
  assert.equal(exportResult.render_contract_hash, run.render_contract.render_hash);
});
