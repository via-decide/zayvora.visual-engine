# Remotion Adapter

This adapter maps Zayvora deterministic visual artifacts to Remotion-style compositions.

## Deterministic sources

- Render contract
- Scene graph
- Timeline
- Asset manifest
- Fixed render config

## Composition model

`Root.jsx` derives width, height, fps, and duration directly from render contract values and registers `ZayvoraComposition` with fixed `defaultProps`.
