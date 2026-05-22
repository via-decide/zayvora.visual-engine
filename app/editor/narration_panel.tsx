import React from 'react';

export function NarrationPanel({ lines, onEdit }: { lines: any[]; onEdit: (sceneId: string, text: string) => void }) {
  return (
    <div>
      {lines.map((line) => (
        <div key={line.scene_id}>
          <span>{line.scene_id}: {line.text}</span>
          <button onClick={() => onEdit(line.scene_id, `${line.text} (Voice edit)`) }>Edit Narration</button>
        </div>
      ))}
    </div>
  );
}
