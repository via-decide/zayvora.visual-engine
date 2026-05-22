import { renderTextLayer } from './TextLayer.js';
import { renderShapeLayer } from './ShapeLayer.js';
import { renderImageLayer } from './ImageLayer.js';
import { renderMotionLayer } from './MotionLayer.js';

function renderBackgroundLayer(layer) {
  return {
    type: 'background',
    layer_id: layer.layer_id,
    color: layer.color ?? '#000000',
    deterministic: true,
  };
}

function renderGroupLayer(layer, frame, context) {
  return {
    type: 'group',
    layer_id: layer.layer_id,
    children: (layer.children ?? []).map((child) => renderLayer(child, frame, context)),
    deterministic: true,
  };
}

export function renderLayer(layer, frame, context = {}) {
  switch (layer.type) {
    case 'text':
      return renderTextLayer(layer, frame, context);
    case 'shape':
      return renderShapeLayer(layer, frame, context);
    case 'image':
      return renderImageLayer(layer, frame, context);
    case 'background':
      return renderBackgroundLayer(layer, frame, context);
    case 'motion':
      return renderMotionLayer(layer, frame, context);
    case 'group':
      return renderGroupLayer(layer, frame, context);
    default:
      return { type: 'unknown', layer_id: layer.layer_id, deterministic: true };
  }
}
