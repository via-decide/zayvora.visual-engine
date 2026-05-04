"use client"

import { useRef, useState } from "react"
import { computeGesture } from "@/lib/gesture/gesture-engine"
import { resolveState } from "@/lib/ui/state-machine"
import LayerStack from "./LayerStack"

export default function VisualRoot() {
  const [position, setPosition] = useState(0)
  const [offset, setOffset] = useState(0)

  const startX = useRef(0)
  const startTime = useRef(0)

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    startX.current = e.touches[0].clientX
    startTime.current = performance.now()
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const deltaX = e.touches[0].clientX - startX.current
    const deltaTime = performance.now() - startTime.current

    const gesture = computeGesture({
      deltaX,
      deltaTime,
      screenWidth: window.innerWidth
    })

    setOffset(gesture.distanceRatio * window.innerWidth)
  }

  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    const deltaX = e.changedTouches[0].clientX - startX.current
    const deltaTime = performance.now() - startTime.current

    const gesture = computeGesture({
      deltaX,
      deltaTime,
      screenWidth: window.innerWidth
    })

    const next = resolveState(position, gesture)

    setPosition(Math.max(0, Math.min(2, next)))
    setOffset(0)
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        overflow: "hidden"
      }}
    >
      <div
        style={{
          display: "flex",
          width: "300%",
          transform: `translateX(calc(${-position * 100}% + ${offset}px))`,
          transition: "transform 300ms ease-out"
        }}
      >
        <LayerStack />
      </div>
    </div>
  )
}
