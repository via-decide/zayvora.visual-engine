import InputLayer from "./layers/InputLayer"
import ModeLayer from "./layers/ModeLayer"
import OutputLayer from "./layers/OutputLayer"
import TraceLayer from "./layers/TraceLayer"

type LayerStackProps = {
  activeLayer: number
}

const layers = [<InputLayer key="input" />, <ModeLayer key="mode" />, <OutputLayer key="output" />, <TraceLayer key="trace" />]

export default function LayerStack({ activeLayer }: LayerStackProps) {
  const boundedLayer = Math.max(0, Math.min(activeLayer, layers.length - 1))

  return (
    <div
      style={{
        display: "flex",
        width: `${layers.length * 100}vw`,
        transform: `translateX(-${boundedLayer * 100}vw)`,
        transition: "transform 0.3s ease",
      }}
    >
      {layers.map((layer, i) => (
        <div key={i} style={{ width: "100vw", height: "100vh" }}>
          {layer}
        </div>
      ))}
    </div>
  )
}
