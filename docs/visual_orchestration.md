# Visual Orchestration

`VisualOrchestrator` coordinates deterministic generation:

1. `generateVisualPlan()` / `generateSceneGraph()`
2. `generateTimeline()`
3. `generateRenderContract()`
4. `dispatchRender()`
5. `generateOutputManifest()`

No renderer-specific generation logic is embedded in scene/timeline creation.
Renderers are invoked only after contract creation.
