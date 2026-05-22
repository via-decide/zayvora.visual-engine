export function renderImageLayer(layer) {
  return {
    type: 'image',
    layer_id: layer.layer_id,
    asset_id: layer.asset_id,
    src: layer.src ?? layer.path ?? '',
    position: layer.position,
    dimensions: layer.dimensions ?? null,
    fit: layer.fit ?? 'cover',
    deterministic: true,
  };
}
