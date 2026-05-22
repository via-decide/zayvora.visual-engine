export function renderTextLayer(layer) {
  return {
    type: 'text',
    layer_id: layer.layer_id,
    content: layer.content,
    position: layer.position,
    dimensions: layer.dimensions ?? null,
    style: {
      fontFamily: layer.style?.fontFamily ?? 'Inter, Arial, sans-serif',
      fontSize: layer.style?.fontSize ?? 48,
      fontWeight: layer.style?.fontWeight ?? 700,
      color: layer.style?.color ?? '#FFFFFF',
      ...layer.style,
    },
    deterministic: true,
  };
}
