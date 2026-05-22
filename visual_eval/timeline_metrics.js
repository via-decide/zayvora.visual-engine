export function frameContinuity(timeline) {
  const segments = timeline.segments ?? [];
  if (!segments.length) return { valid: true, gaps: 0 };
  let expected = segments[0].start_frame;
  let gaps = 0;
  for (const segment of segments) {
    if (segment.start_frame !== expected) gaps += 1;
    expected = segment.start_frame + segment.duration_frames;
  }
  return { valid: gaps === 0, gaps };
}

export function transitionValidity(timeline) {
  const transitions = timeline.transitions ?? [];
  const valid = transitions.every((transition) => Number.isInteger(transition.start_frame) && Number.isInteger(transition.duration_frames) && transition.duration_frames > 0);
  return valid ? 1 : 0;
}

export function durationConsistency(timeline) {
  const segments = timeline.segments ?? [];
  if (!segments.length) return 1;
  const allInts = segments.every((segment) => Number.isInteger(segment.duration_frames) && segment.duration_frames > 0);
  return allInts ? 1 : 0;
}

export function keyframeValidity(timeline) {
  const keyframes = timeline.keyframes ?? [];
  const valid = keyframes.every((keyframe) => Number.isInteger(keyframe.frame) && keyframe.track_id);
  return valid ? 1 : 0;
}

export function sceneOrderingScore(timeline) {
  const segments = timeline.segments ?? [];
  if (!segments.length) return 1;
  let ordered = 0;
  for (let i = 1; i < segments.length; i += 1) {
    if (segments[i].start_frame >= segments[i - 1].start_frame) ordered += 1;
  }
  return segments.length === 1 ? 1 : ordered / (segments.length - 1);
}
