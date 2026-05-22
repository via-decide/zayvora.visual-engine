export function suggestVisualImprovements(sceneGraph = { scenes: [] }) {
  const scenes = sceneGraph.scenes ?? [];
  return scenes.map((scene, index) => ({
    suggestion_id: `VIS-${String(index + 1).padStart(3, '0')}`,
    type: 'visual',
    scene_id: scene.scene_id,
    text: 'Increase title contrast and align key text to grid columns.',
    score: 0.82,
  }));
}

export function suggestThumbnailIdeas(context = {}) {
  const title = context.title ?? 'Untitled';
  return [
    `Bold keyword thumbnail: "${title.split(' ')[0] ?? 'Key'}" with high-contrast background.`,
    `Split-screen thumbnail showing "Problem vs Fix" for ${title}.`,
  ].map((text, index) => ({
    suggestion_id: `THUMB-${String(index + 1).padStart(3, '0')}`,
    type: 'thumbnail',
    text,
    score: 0.84 - index * 0.05,
  }));
}
