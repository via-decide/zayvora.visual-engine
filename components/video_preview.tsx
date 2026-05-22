import React from 'react';
import { CaptionOverlay } from './caption_overlay';

export function VideoPreview({ preview }: { preview: any }) {
  return (
    <div style={{ border: '1px solid #222', padding: 12 }}>
      <h3>Preview ({preview.target})</h3>
      <div>Scenes: {preview.preview_model.scenes.length}</div>
      <div>Timeline Segments: {preview.preview_model.timeline.length}</div>
      <div>Commands: {preview.preview_model.command_count}</div>
      <CaptionOverlay captions={[{ text: 'Deterministic preview active.' }]} />
    </div>
  );
}
