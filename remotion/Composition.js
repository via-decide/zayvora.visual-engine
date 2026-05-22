import { renderScene } from './SceneRenderer.js';

export function resolveActiveScene(timeline, frame) {
  const segments = timeline?.segments ?? [];
  return segments.find((segment) => {
    const start = segment.start_frame;
    const end = segment.start_frame + segment.duration_frames - 1;
    return frame >= start && frame <= end;
  }) ?? null;
}

export function applyDeterministicTransition(timeline, frame, sceneId) {
  const transitions = timeline?.transitions ?? [];
  const active = transitions.find((transition) => {
    const start = transition.start_frame;
    const end = transition.start_frame + transition.duration_frames - 1;
    return frame >= start && frame <= end;
  });
  if (!active) return { type: 'none', progress: 0, scene_id: sceneId };
  const progress = (frame - active.start_frame) / active.duration_frames;
  return { type: active.type, progress, scene_id: sceneId };
}

export function ZayvoraComposition(props) {
  const frame = Number.isInteger(props.frame) ? props.frame : 0;
  const activeSegment = resolveActiveScene(props.timeline, frame);
  if (!activeSegment) {
    return { frame, scene: null, layers: [], transition: { type: 'none', progress: 0 } };
  }
  const transition = applyDeterministicTransition(props.timeline, frame, activeSegment.scene_id);
  const scene = (props.scene_graph?.scenes ?? []).find((item) => item.scene_id === activeSegment.scene_id) ?? null;
  const layers = scene ? renderScene(scene, frame, props) : [];
  return {
    frame,
    scene,
    layers,
    transition,
    layout_locked: true,
  };
}
