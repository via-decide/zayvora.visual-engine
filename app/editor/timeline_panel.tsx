import React from 'react';
import { TimelineScrubber } from '../../components/timeline_scrubber';

export function TimelinePanel({ segments, onAdjustTiming }: { segments: any[]; onAdjustTiming: (sceneId: string, durationFrames: number) => void }) {
  return <TimelineScrubber segments={segments} onAdjust={onAdjustTiming} />;
}
