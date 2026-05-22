import React from 'react';
import { VideoPreview } from '../../components/video_preview';

export function PreviewPanel({ preview }: { preview: any }) {
  return <VideoPreview preview={preview} />;
}
