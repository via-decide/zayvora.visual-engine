import { sha256Hash } from './visual_hash.js';

export class TimelineModel {
  constructor() {
    this.timeline = this.createTimeline();
  }

  createTimeline() {
    this.timeline = { segments: [], keyframes: [], transitions: [] };
    return this.timeline;
  }

  addSceneSegment(sceneId, startFrame, durationFrames, layered = false) {
    if (!Number.isInteger(startFrame) || !Number.isInteger(durationFrames)) {
      throw new Error('startFrame and durationFrames must be integer frames');
    }
    this.timeline.segments.push({ scene_id: sceneId, start_frame: startFrame, duration_frames: durationFrames, layered });
    return this;
  }

  addKeyframe(trackId, frame, value) {
    this.timeline.keyframes.push({ track_id: trackId, frame, value });
    return this;
  }

  addTransition(fromSceneId, toSceneId, startFrame, durationFrames, type = 'cut') {
    this.timeline.transitions.push({ from_scene_id: fromSceneId, to_scene_id: toSceneId, start_frame: startFrame, duration_frames: durationFrames, type });
    return this;
  }

  calculateFrameRanges() {
    return this.timeline.segments.map((segment) => ({
      scene_id: segment.scene_id,
      start_frame: segment.start_frame,
      end_frame: segment.start_frame + segment.duration_frames - 1,
    }));
  }

  validateFrameContinuity() {
    const sorted = [...this.timeline.segments].sort((a, b) => a.start_frame - b.start_frame);
    let nextExpected = 0;
    for (const segment of sorted) {
      if (!segment.layered && segment.start_frame !== nextExpected) return false;
      if (!segment.layered && segment.start_frame < nextExpected) return false;
      if (!segment.layered) nextExpected = segment.start_frame + segment.duration_frames;
    }
    return true;
  }

  hashTimeline() {
    return sha256Hash(this.timeline);
  }
}
