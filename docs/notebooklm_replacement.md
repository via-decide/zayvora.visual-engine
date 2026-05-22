# Full NotebookLM Replacement Pipeline

This pipeline connects research-to-video stages end-to-end with deterministic state tracking.

## Stage flow

INPUT
↓
NEX
↓
STORYBOARD
↓
SCRIPT
↓
AUDIO
↓
SCENE GRAPH
↓
TIMELINE
↓
RENDER CONTRACT
↓
VIDEO
↓
YOUTUBE PACKAGE

## Modules

- `pipeline/full_video_pipeline.js` — main end-to-end execution.
- `pipeline/state_manager.js` — stage state and hash tracking.
- `pipeline/orchestrator.js` — stage validation + full trace generation.

## Guarantees

- All stages are connected through one deterministic run.
- Every stage payload is hashed and validated.
- Full trace includes per-stage validity and hashes.
- Re-running identical input yields identical state and trace hashes.
