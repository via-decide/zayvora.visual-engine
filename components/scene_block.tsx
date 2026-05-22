import React from 'react';

export function SceneBlock({ scene, onEditText }: { scene: any; onEditText: (sceneId: string, text: string) => void }) {
  return (
    <div style={{ border: '1px solid #333', padding: 8, marginBottom: 8 }}>
      <strong>{scene.scene_id}</strong>
      <div>{scene.title ?? 'Untitled Scene'}</div>
      <button onClick={() => onEditText(scene.scene_id, `${scene.title ?? 'Scene'} (Edited)`) }>Edit Text</button>
    </div>
  );
}
