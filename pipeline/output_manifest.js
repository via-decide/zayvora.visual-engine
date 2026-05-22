import { sha256Hash } from '../visual/visual_hash.js';

export function createOutputManifest({ request_id, prompt, scene_graph, timeline, render_contract, outputs = [] }) {
  const manifest = {
    request_id,
    prompt_hash: sha256Hash(prompt),
    scene_graph_hash: scene_graph.scene_graph_hash ?? sha256Hash(scene_graph),
    timeline_hash: timeline.timeline_hash ?? sha256Hash(timeline),
    render_contract_hash: render_contract.render_hash ?? sha256Hash(render_contract),
    outputs,
    deterministic: true,
  };
  manifest.manifest_hash = sha256Hash(manifest);
  return manifest;
}
