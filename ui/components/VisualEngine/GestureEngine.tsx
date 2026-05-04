"use client"

import { useRef } from "react"

type GestureEngineProps = {
  onSwipe: React.Dispatch<React.SetStateAction<number>>
}

export default function GestureEngine({ onSwipe }: GestureEngineProps) {
  const startX = useRef(0)

  function handleStart(e: React.TouchEvent<HTMLDivElement>) {
    startX.current = e.touches[0].clientX
  }

  function handleEnd(e: React.TouchEvent<HTMLDivElement>) {
    const diff = e.changedTouches[0].clientX - startX.current

    if (diff > 50) onSwipe((prev) => Math.max(prev - 1, 0))
    if (diff < -50) onSwipe((prev) => prev + 1)
  }

  return (
    <div
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 10,
      }}
    />
  )
}
