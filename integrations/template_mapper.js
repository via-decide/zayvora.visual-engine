export function mapTemplateToSceneGraph(template = {}) {
  const blocks = Array.isArray(template.blocks) ? template.blocks : [];
  const scenes = blocks.map((block, index) => ({
    scene_id: block.scene_id ?? `SCENE-${String(index + 1).padStart(3, '0')}`,
    duration_frames: Number.isInteger(block.duration_frames) ? block.duration_frames : 120,
    template_block_id: block.block_id ?? `BLOCK-${String(index + 1).padStart(3, '0')}`,
    template_type: block.type ?? 'content',
    layers: (block.layers ?? []).map((layer, layerIndex) => ({
      layer_id: layer.layer_id ?? `LAYER-${String(index + 1).padStart(3, '0')}-${String(layerIndex + 1).padStart(3, '0')}`,
      type: layer.type ?? 'text',
      content: layer.content ?? '',
      position: layer.position ?? { x: 120, y: 120 },
      dimensions: layer.dimensions ?? { width: 800, height: 120 },
      style: layer.style ?? {},
      motion: layer.motion ?? {},
      template_origin: true,
    })),
  }));

  return {
    request_id: template.request_id ?? 'CREATOR-REQ-001',
    title: template.title ?? 'Creator Template',
    template_id: template.template_id ?? 'TEMPLATE-001',
    scenes,
    deterministic: true,
  };
}

export function preserveTemplateStructure(template = {}, scene_graph = {}) {
  return {
    template_id: template.template_id ?? 'TEMPLATE-001',
    block_count: (template.blocks ?? []).length,
    scene_count: (scene_graph.scenes ?? []).length,
    compatible: (template.blocks ?? []).length === (scene_graph.scenes ?? []).length,
  };
}
