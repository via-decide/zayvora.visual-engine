import test from 'node:test';
import assert from 'node:assert/strict';
import { VisualOrchestrator } from '../visual_orchestrator.js';

test('output manifest preserves hashes and pipeline determinism', () => {
  const prompt = 'Deterministic pipeline prompt';
  const run = () => {
    const orchestrator = new VisualOrchestrator({ renderer: 'json', request_id: 'VISUAL-001' });
    const sceneGraph = orchestrator.generateSceneGraph(prompt);
    const timeline = orchestrator.generateTimeline(sceneGraph);
    const contract = orchestrator.generateRenderContract(sceneGraph, timeline);
    const output = orchestrator.dispatchRender(contract, sceneGraph, timeline);
    const manifest = orchestrator.generateOutputManifest(sceneGraph.request_id, prompt, sceneGraph, timeline, contract, output);
    return { contract, manifest };
  };
  const a = run();
  const b = run();
  assert.equal(a.manifest.render_contract_hash, a.contract.render_hash);
  assert.equal(a.contract.render_hash, b.contract.render_hash);
  assert.equal(a.manifest.manifest_hash, b.manifest.manifest_hash);
});
