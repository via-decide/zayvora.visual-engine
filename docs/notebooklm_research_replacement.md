# NotebookLM-Style Source-Grounded Research Workflow

Nex replaces NotebookLM research, not by guessing, but by verified source orchestration.

## Pipeline

INPUT TOPIC / URL / DOC  
↓  
SOURCE DISCOVERY  
↓  
RESOURCE INGESTION  
↓  
EVIDENCE EXTRACTION  
↓  
SOURCE QUALITY SCORING  
↓  
RESEARCH BRIEF  
↓  
VIDEO RESEARCH PACKAGE  
↓  
VERIFICATION GATE  
↓  
VISUAL ENGINE HANDOFF

## Modules

- `pipeline/notebook_research_pipeline.js` — end-to-end pipeline runner with state + trace.
- `pipeline/research_orchestrator.js` — stage orchestration across discovery→handoff.
- `pipeline/pipeline_state.js` — stage status + per-stage hash tracking.
- `pipeline/pipeline_trace_logger.js` — full timestamped trace logging.

## Guarantees

- Connects all research modules in one workflow.
- Tracks stage status and stores hashes per stage.
- Produces verified, video-ready research packages.
- Exports visual-engine handoff payload.
- Logs full pipeline trace for reproducibility.

## Success criteria

Nex can independently gather internet resources, verify them, and prepare YouTube-ready research without Google NotebookLM.
