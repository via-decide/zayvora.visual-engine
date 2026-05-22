import test from 'node:test';
import assert from 'node:assert/strict';
import { promptToSceneGraph } from '../prompt_to_scene.js';
import { sceneGraphToTimeline } from '../scene_to_timeline.js';
import { timelineToRenderContract } from '../timeline_to_contract.js';
import { dispatchToHTML, dispatchToRemotion } from '../render_dispatcher.js';

test('render dispatcher keeps same contract hash for html and remotion', () => {
  const graph = promptToSceneGraph('Prompt', { request_id: 'VISUAL-001' });
  const timeline = sceneGraphToTimeline(graph);
  const contract = timelineToRenderContract({
    request_id: graph.request_id,
    prompt: graph.prompt,
    normalized_intent: graph.normalized_intent,
    scene_graph: graph,
    timeline,
    renderer: 'remotion',
  });
  const html = dispatchToHTML(contract);
  const remotion = dispatchToRemotion(contract, graph, timeline, { assets: [] });
  assert.equal(html.contract_hash, contract.render_hash);
  assert.equal(remotion.contract_hash, contract.render_hash);
});
