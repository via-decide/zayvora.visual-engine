export function renderShapeLayer(layer) {
  return {
    type: 'shape',
    layer_id: layer.layer_id,
    shape: layer.shape ?? 'rect',
    position: layer.position,
    dimensions: layer.dimensions ?? { width: 100, height: 100 },
    style: {
      fill: layer.style?.fill ?? '#000000',
      stroke: layer.style?.stroke ?? 'transparent',
      ...layer.style,
    },
    deterministic: true,
  };
}
