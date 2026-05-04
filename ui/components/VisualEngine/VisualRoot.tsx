import React, { useMemo, useRef, useState } from 'react'
import { computeGesture } from '../../lib/gesture/gesture-engine'
import { resolveState } from '../../lib/ui/state-machine'
import { LayerStack } from './LayerStack'

const MAX_POSITION = 2

function easeOut(value: number): number {
  const t = Math.max(-1, Math.min(1, value))
  return 1 - Math.pow(1 - Math.abs(t), 3)
}

function buildExecutionPlan() {
  void fetch('/api/run', { method: 'POST' })
}

export function VisualRoot() {
  const [position, setPosition] = useState(0)
  const [offset, setOffset] = useState(0)
  const startXRef = useRef(0)
  const startTimeRef = useRef(0)
  const latestGestureRef = useRef(computeGesture({ deltaX: 0, deltaTime: 1, screenWidth: 1 }))

  const screenWidth = useMemo(() => window.innerWidth || 1, [])

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    startXRef.current = e.touches[0].clientX
    startTimeRef.current = performance.now()
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const deltaX = e.touches[0].clientX - startXRef.current
    const deltaTime = performance.now() - startTimeRef.current
    const gesture = computeGesture({ deltaX, deltaTime, screenWidth })
    latestGestureRef.current = gesture
    setOffset(easeOut(gesture.distanceRatio) * screenWidth)
  }

  function onTouchEnd() {
    const next = resolveState(position, latestGestureRef.current, MAX_POSITION)
    setPosition(next)
    setOffset(0)

    if (next === MAX_POSITION) {
      buildExecutionPlan()
    }
  }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        style={{
          transform: `translateX(${position * -100 + offset}px)`,
          transition: 'transform 300ms ease-out'
        }}
      >
        <LayerStack />
      </div>
    </div>
  )
}
