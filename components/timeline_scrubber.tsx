import React from 'react';

export function TimelineScrubber({ segments, onAdjust }: { segments: any[]; onAdjust: (sceneId: string, duration: number) => void }) {
  return (
    <div>
      {segments.map((seg) => (
        <div key={seg.scene_id}>
          <span>{seg.scene_id}: {seg.duration_frames}f</span>
          <button onClick={() => onAdjust(seg.scene_id, seg.duration_frames + 15)}>+15f</button>
        </div>
      ))}
    </div>
  );
}
