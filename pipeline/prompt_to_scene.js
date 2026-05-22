import { sha256Hash } from '../visual/visual_hash.js';

export function extractTitle(prompt) {
  const trimmed = (prompt ?? '').trim();
  if (!trimmed) return 'Untitled Visual';
  return trimmed.split(/[.!?\n]/)[0].trim() || 'Untitled Visual';
}

export function extractSections(prompt) {
  const lines = (prompt ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return [extractTitle(prompt)];
  return lines.slice(0, 8);
}

export function extractVisualTone(prompt) {
  const source = (prompt ?? '').toLowerCase();
  if (source.includes('serious') || source.includes('enterprise')) return 'professional';
  if (source.includes('playful') || source.includes('fun')) return 'playful';
  return 'neutral';
}

export function extractLayoutMode(prompt) {
  const source = (prompt ?? '').toLowerCase();
  if (source.includes('split')) return 'split_screen';
  if (source.includes('carousel')) return 'carousel';
  return 'single_column';
}

export function createLayerPlan(scene, index) {
  const stable = String(index + 1).padStart(3, '0');
  return [
    {
      layer_id: `LAYER-TEXT-${stable}`,
      type: 'text',
      content: scene.title,
      position: { x: 120, y: 120 },
      style: { fontSize: 56, fontWeight: 700, color: '#FFFFFF' },
      motion: {},
    },
  ];
}

export function createScenePlan(prompt, config = {}) {
  const sections = extractSections(prompt);
  const maxScenes = config.max_scenes ?? 4;
  const deterministicSections = sections.slice(0, maxScenes);
  return deterministicSections.map((section, index) => {
    const sceneId = `SCENE-${String(index + 1).padStart(3, '0')}`;
    const title = index === 0 ? extractTitle(prompt) : section;
    return {
      scene_id: sceneId,
      duration_frames: config.scene_duration_frames ?? 120,
      title,
      layers: createLayerPlan({ title }, index),
    };
  });
}

export function promptToSceneGraph(prompt, config = {}) {
  const scenePlan = createScenePlan(prompt, config);
  const normalized_intent = {
    title: extractTitle(prompt),
    tone: extractVisualTone(prompt),
    layout_mode: extractLayoutMode(prompt),
    section_count: scenePlan.length,
  };
  const scene_graph = {
    schema_version: '1.0.0',
    request_id: config.request_id ?? `VISUAL-${sha256Hash(prompt).slice(7, 15).toUpperCase()}`,
    prompt,
    normalized_intent,
    scenes: scenePlan,
    deterministic: true,
  };
  scene_graph.scene_graph_hash = sha256Hash(scene_graph);
  return scene_graph;
}
