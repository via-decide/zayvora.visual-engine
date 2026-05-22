# Remotion Generation API

## Endpoints

- `POST /api/render`
- `POST /api/video`

## Request

```json
{
  "prompt": "explain why APIs fail at scale",
  "target": "remotion",
  "format": "mp4",
  "width": 1920,
  "height": 1080,
  "fps": 30
}
```

## Response

```json
{
  "request_id": "VISUAL-001",
  "render_contract_hash": "sha256:...",
  "output_manifest": {},
  "deterministic": true
}
```
