# Ecosystem Contract Layer

The ecosystem contract is the canonical payload shared across `nex`, `creator-tool`, and `visual-engine`.

## Canonical structure

```json
{
  "request_id": "",
  "source": "nex|creator-tool|manual",
  "context_manifest": {},
  "research_output": {},
  "storyboard": {},
  "scene_graph": {},
  "timeline": {},
  "audio_manifest": {},
  "asset_manifest": {},
  "render_contract": {},
  "hash": "sha256:..."
}
```

## Rules

- Schema is strict and rejects additional fields.
- All required fields must be present.
- Hash is deterministic and covers the full payload except `hash`.
- Invalid source values are rejected.
- Incomplete contracts are rejected and cannot be registered.
