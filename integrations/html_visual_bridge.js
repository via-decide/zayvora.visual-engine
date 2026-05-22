import { sha256Hash } from '../visual/visual_hash.js';

export function contractToSlideJSON(renderContract) {
  return {
    request_id: renderContract.request_id,
    scene_graph_hash: renderContract.scene_graph_hash,
    timeline_hash: renderContract.timeline_hash,
    scenes: renderContract.scenes,
    deterministic: true,
  };
}

export function contractToHTMLCarousel(renderContract) {
  const slides = (renderContract.scenes ?? []).map((scene) => ({
    scene_id: scene.scene_id,
    layers: scene.layers,
  }));
  return {
    renderer: 'html',
    scene_graph_hash: renderContract.scene_graph_hash,
    slides,
    html_hash: sha256Hash(slides),
    deterministic: true,
  };
}

export function verifyHTMLParity(renderContract, htmlOutput) {
  return htmlOutput.scene_graph_hash === renderContract.scene_graph_hash;
}
