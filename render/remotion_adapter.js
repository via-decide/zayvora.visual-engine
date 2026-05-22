import { registerComposition } from '../remotion/Root.js';
import { ZayvoraComposition } from '../remotion/Composition.js';
import { sha256Hash } from '../visual/visual_hash.js';

export function renderFramesFromContract({ render_contract, scene_graph, timeline }) {
  const composition = registerComposition(render_contract);
  const frames = [];
  for (let frame = 0; frame < render_contract.duration_frames; frame += 1) {
    frames.push(ZayvoraComposition({ frame, scene_graph, timeline }));
  }
  const frames_hash = sha256Hash(frames);
  return {
    composition,
    frames,
    frames_hash,
    frame_count: frames.length,
    deterministic: true,
  };
}
