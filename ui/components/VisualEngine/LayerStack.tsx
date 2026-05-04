import IntentLayer from "./layers/IntentLayer"
import StructureLayer from "./layers/StructureLayer"
import OutputLayer from "./layers/OutputLayer"

export default function LayerStack() {
  return (
    <>
      <div style={{ width: "100vw" }}>
        <IntentLayer />
      </div>

      <div style={{ width: "100vw" }}>
        <StructureLayer />
      </div>

      <div style={{ width: "100vw" }}>
        <OutputLayer />
      </div>
    </>
  )
}
