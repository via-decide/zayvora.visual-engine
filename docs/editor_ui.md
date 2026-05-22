# Visual Video Editor UI

The editor UI provides an interactive deterministic editing surface for video generation.

## Features

- Loads an ecosystem-style contract into editor state.
- Displays scenes, timeline, narration, assets, and preview panels.
- Supports edits for text, timing, and narration.
- Emits deterministic edit commands (`CMD-00001`, `CMD-00002`, ...).
- Uses command emission only (no direct mutation of source contract).
- Supports preview modeling for HTML/Remotion targets.

## Determinism rule

All edits are represented as append-only command objects with stable IDs and explicit payloads.
