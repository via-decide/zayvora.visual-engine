export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function resolveState(current: number, gesture: { score: number; distanceRatio: number }, max: number): number {
  if (gesture.score > 0.3) {
    const next = current + (gesture.distanceRatio > 0 ? 1 : -1)
    return clamp(next, 0, max)
  }

  return current
}
