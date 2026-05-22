# Render Contract Specification

The render contract is the exact handoff payload between Zayvora Visual Engine and renderers.

## Contract fields

- `contract_id`
- `renderer` (`html` or `remotion`)
- `width`, `height`
- `fps`
- `duration_frames`
- `scene_graph_hash`
- `timeline_hash`
- `asset_manifest_hash`
- `contract_hash`

## Integrity model

- Contract hash is computed from all contract fields except `contract_hash`.
- Contract may be frozen before adapter execution.
- Hash verification must pass before rendering starts.
