import { sha256Hash } from '../visual/visual_hash.js';

const DEFAULT_CONFIG = {
  fps: 30,
  scene_duration_frames: 120,
  transition_frames: 15,
};

export function assignSceneDurations(sceneGraph, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  return (sceneGraph.scenes ?? []).map((scene, index) => ({
    scene_id: scene.scene_id,
    start_frame: index * cfg.scene_duration_frames,
    duration_frames: scene.duration_frames ?? cfg.scene_duration_frames,
    layered: false,
  }));
}

export function assignTransitions(segments, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const transitions = [];
  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    transitions.push({
      from_scene_id: segment.scene_id,
      to_scene_id: segments[i + 1].scene_id,
      start_frame: segment.start_frame + segment.duration_frames - cfg.transition_frames,
      duration_frames: cfg.transition_frames,
      type: 'fade',
    });
  }
  return transitions;
}

export function assignLayerKeyframes(sceneGraph) {
  return (sceneGraph.scenes ?? []).flatMap((scene, sceneIndex) =>
    (scene.layers ?? []).map((layer) => ({
      track_id: `${scene.scene_id}:${layer.layer_id}`,
      frame: sceneIndex * (scene.duration_frames ?? DEFAULT_CONFIG.scene_duration_frames),
      value: { opacity: 1 },
    })),
  );
}

export function calculateTotalFrames(segments) {
  if (!segments.length) return 0;
  const last = segments[segments.length - 1];
  return last.start_frame + last.duration_frames;
}

export function validateTimeline(timeline) {
  let expected = 0;
  for (const segment of timeline.segments) {
    if (!Number.isInteger(segment.start_frame) || !Number.isInteger(segment.duration_frames)) return false;
    if (segment.start_frame !== expected) return false;
    expected = segment.start_frame + segment.duration_frames;
  }
  return true;
}

export function sceneGraphToTimeline(sceneGraph, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const segments = assignSceneDurations(sceneGraph, cfg);
  const timeline = {
    fps: cfg.fps,
    segments,
    transitions: assignTransitions(segments, cfg),
    keyframes: assignLayerKeyframes(sceneGraph),
    total_frames: calculateTotalFrames(segments),
    deterministic: true,
  };
  timeline.timeline_hash = sha256Hash(timeline);
  return timeline;
}
