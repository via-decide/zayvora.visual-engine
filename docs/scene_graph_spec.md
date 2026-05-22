# Scene Graph Specification

`SceneGraphBuilder` produces reproducible scene structures.

## Scene shape

- `scene_id`: stable scene identifier.
- `duration_frames`: integer duration in frames.
- `layers`: ordered visual layers.

## Layer node types

- `text`: content + position + style + motion.
- `shape`: geometry definition + styling + motion.
- `image`: asset reference + layout + motion.
- `motion`: keyframe instructions applied to target layer.

## Deterministic behavior

- Graph hashing uses stable key ordering.
- Rebuilding identical inputs yields identical scene hashes.
