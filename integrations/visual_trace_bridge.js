import { sha256Hash } from '../visual/visual_hash.js';

export function buildVisualTrace({ prompt, enrichment, scene_graph, timeline, render_contract, renderer_target, output_manifest }) {
  return {
    trace_id: `TRACE-${render_contract.request_id}`,
    prompt_hash: sha256Hash(prompt),
    enrichment_hash: sha256Hash(enrichment ?? {}),
    scene_graph_hash: scene_graph.scene_graph_hash ?? sha256Hash(scene_graph),
    timeline_hash: timeline.timeline_hash ?? sha256Hash(timeline),
    render_contract_hash: render_contract.render_hash ?? sha256Hash(render_contract),
    renderer_target,
    output_hash: sha256Hash(output_manifest ?? {}),
    deterministic: true,
  };
}
