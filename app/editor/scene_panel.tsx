import React from 'react';
import { SceneBlock } from '../../components/scene_block';

export function ScenePanel({ scenes, onEditText }: { scenes: any[]; onEditText: (sceneId: string, text: string) => void }) {
  return <div>{scenes.map((scene) => <SceneBlock key={scene.scene_id} scene={scene} onEditText={onEditText} />)}</div>;
}
