import { renderLayer } from './LayerRenderer.js';

export function renderScene(scene, frame, context = {}) {
  return (scene.layers ?? []).map((layer) => renderLayer(layer, frame, context));
}
