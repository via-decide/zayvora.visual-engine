"use client"

import { useState } from "react"
import GestureEngine from "./GestureEngine"
import LayerStack from "./LayerStack"

export default function VisualRoot() {
  const [layerIndex, setLayerIndex] = useState(0)

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <GestureEngine onSwipe={setLayerIndex} />
      <LayerStack activeLayer={layerIndex} />
    </div>
  )
}
