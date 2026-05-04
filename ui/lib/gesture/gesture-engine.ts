export type GestureInput = {
  deltaX: number
  deltaTime: number
  screenWidth: number
}

export type GestureResult = {
  distanceRatio: number
  velocity: number
  score: number
  intent: 'swipe' | 'drag' | 'tap'
}

export function computeGesture(input: GestureInput): GestureResult {
  const { deltaX, deltaTime, screenWidth } = input

  let distanceRatio = screenWidth === 0 ? 0 : deltaX / screenWidth
  if (Math.abs(distanceRatio) > 0.5) {
    distanceRatio *= 0.6
  }

  const safeDeltaTime = deltaTime <= 0 ? 1 : deltaTime
  const velocity = deltaX / safeDeltaTime

  const score =
    distanceRatio * 0.6 +
    Math.min(Math.abs(velocity), 1) * 0.4

  return {
    distanceRatio,
    velocity,
    score,
    intent:
      velocity > 0.5 ? 'swipe' : distanceRatio > 0.05 ? 'drag' : 'tap'
  }
}
