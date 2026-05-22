# Nex to Visual-Engine Storyboard Handoff

Nex does research. Visual-engine makes video.

## Handoff flow

TOPIC  
↓  
SOURCES  
↓  
EVIDENCE  
↓  
RESEARCH BRIEF  
↓  
VIDEO RESEARCH PACKAGE  
↓  
VERIFIED HANDOFF  
↓  
VISUAL ENGINE

## Responsibilities

- Convert verified research package into storyboard payload.
- Preserve citations.
- Preserve source cards.
- Preserve claim-to-evidence mapping.
- Export ecosystem contract.
- Validate handoff compatibility.

## Modules

- `integrations/visual_engine_handoff.js` — top-level handoff orchestration.
- `integrations/storyboard_payload_builder.js` — package-to-storyboard transformation.
- `integrations/ecosystem_contract_exporter.js` — contract-compatible export.
- `integrations/handoff_validator.js` — compatibility checks before handoff.

## Success criteria

Nex becomes the research brain for your NotebookLM replacement.
