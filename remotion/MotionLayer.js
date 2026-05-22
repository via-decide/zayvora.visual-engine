const EASING_TABLE = {
  linear: (t) => t,
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

export function renderMotionLayer(layer, frame) {
  const keyframes = layer.keyframes ?? [];
  const easingName = layer.easing ?? 'linear';
  const easing = EASING_TABLE[easingName] ?? EASING_TABLE.linear;
  const values = keyframes.filter((keyframe) => keyframe.frame <= frame);
  const last = values[values.length - 1] ?? null;
  return {
    type: 'motion',
    layer_id: layer.layer_id,
    target_layer_id: layer.target_layer_id,
    easing: easingName,
    progress: easing(Math.max(0, Math.min(1, layer.duration_frames ? frame / layer.duration_frames : 0))),
    value: last?.value ?? null,
    deterministic: true,
  };
}
