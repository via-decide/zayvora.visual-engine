export function detectOverflow(sceneGraph, viewport = { width: 1920, height: 1080 }) {
  const issues = [];
  for (const scene of sceneGraph.scenes ?? []) {
    for (const layer of scene.layers ?? []) {
      const pos = layer.position ?? { x: 0, y: 0 };
      const dim = layer.dimensions ?? { width: 0, height: 0 };
      if (pos.x < 0 || pos.y < 0 || pos.x + dim.width > viewport.width || pos.y + dim.height > viewport.height) {
        issues.push({ scene_id: scene.scene_id, layer_id: layer.layer_id, type: 'overflow' });
      }
    }
  }
  return issues;
}

export function detectLayerCollision(sceneGraph) {
  const collisions = [];
  for (const scene of sceneGraph.scenes ?? []) {
    const layers = scene.layers ?? [];
    for (let i = 0; i < layers.length; i += 1) {
      for (let j = i + 1; j < layers.length; j += 1) {
        const a = layers[i];
        const b = layers[j];
        const ap = a.position ?? { x: 0, y: 0 };
        const ad = a.dimensions ?? { width: 0, height: 0 };
        const bp = b.position ?? { x: 0, y: 0 };
        const bd = b.dimensions ?? { width: 0, height: 0 };
        const overlap = ap.x < bp.x + bd.width && ap.x + ad.width > bp.x && ap.y < bp.y + bd.height && ap.y + ad.height > bp.y;
        if (overlap) collisions.push({ scene_id: scene.scene_id, layer_a: a.layer_id, layer_b: b.layer_id });
      }
    }
  }
  return collisions;
}

export function scoreAlignment(sceneGraph) {
  const layers = (sceneGraph.scenes ?? []).flatMap((scene) => scene.layers ?? []);
  if (!layers.length) return 1;
  const aligned = layers.filter((layer) => (layer.position?.x ?? 0) % 10 === 0 && (layer.position?.y ?? 0) % 10 === 0).length;
  return aligned / layers.length;
}

export function scoreSpacing(sceneGraph) {
  const layers = (sceneGraph.scenes ?? []).flatMap((scene) => scene.layers ?? []);
  if (layers.length < 2) return 1;
  let good = 0;
  for (let i = 1; i < layers.length; i += 1) {
    const prev = layers[i - 1].position?.y ?? 0;
    const cur = layers[i].position?.y ?? 0;
    if (Math.abs(cur - prev) >= 20) good += 1;
  }
  return good / (layers.length - 1);
}

export function scoreReadableText(sceneGraph) {
  const textLayers = (sceneGraph.scenes ?? []).flatMap((scene) => (scene.layers ?? []).filter((layer) => layer.type === 'text'));
  if (!textLayers.length) return 1;
  const readable = textLayers.filter((layer) => (layer.style?.fontSize ?? 0) >= 16).length;
  return readable / textLayers.length;
}

export function scoreViewportFit(sceneGraph, viewport = { width: 1920, height: 1080 }) {
  const overflow = detectOverflow(sceneGraph, viewport).length;
  const total = (sceneGraph.scenes ?? []).reduce((sum, scene) => sum + (scene.layers ?? []).length, 0);
  if (total === 0) return 1;
  return Math.max(0, 1 - overflow / total);
}
