import { sha256Hash } from '../visual/visual_hash.js';

export function generateThumbnailPlan({ title, scene_graph }) {
  const firstScene = scene_graph?.scenes?.[0] ?? null;
  const plan = {
    type: 'thumbnail-plan',
    title: title ?? 'Untitled',
    source_scene_id: firstScene?.scene_id ?? 'SCENE-001',
    style: 'high-contrast-text-overlay',
    output_path: 'outputs/thumbnail.png',
    deterministic: true,
  };
  plan.thumbnail_hash = sha256Hash(plan);
  return plan;
}
