import { sha256Hash } from '../visual/visual_hash.js';

export function timelineToRenderContract({ request_id, prompt, normalized_intent, scene_graph, timeline, assets = { assets: [] }, format = '16:9', dimensions = { width: 1920, height: 1080 }, renderer = 'remotion' }) {
  const base = {
    schema_version: '1.0.0',
    contract_id: `RENDER-${request_id}`,
    request_id,
    prompt,
    normalized_intent,
    renderer,
    format,
    duration: { frames: timeline.total_frames, fps: timeline.fps },
    duration_frames: timeline.total_frames,
    fps: timeline.fps,
    dimensions,
    width: dimensions.width,
    height: dimensions.height,
    scenes: scene_graph.scenes,
    timeline,
    assets,
    scene_graph_hash: scene_graph.scene_graph_hash ?? sha256Hash(scene_graph),
    timeline_hash: timeline.timeline_hash ?? sha256Hash(timeline),
    asset_manifest_hash: sha256Hash(assets),
    deterministic: true,
  };
  base.render_hash = sha256Hash(base);
  return base;
}
