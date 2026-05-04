# Zayvora Full Local System

Local vague prompt → promptalchemy enrichment → Zayvora core → trace engine → slide JSON → deterministic HTML carousel workspace.

## Run

```bash
npm start
```

Open:

```text
http://localhost:7070
```

NFC card URL:

```text
http://localhost:7070/?mode=create
```

CLI:

```bash
npm run cli -- "why APIs fail at scale"
```

## Layers

- `promptalchemy/` expands vague input into usable creative intent.
- `engine/zayvora-core.js` orchestrates the local brain.
- `engine/trace-engine.js` records a visible reasoning/task trace without exposing private chain-of-thought.
- `engine/slide-json-engine.js` creates generic carousel specs for any topic.
- `renderer/` renders slide JSON into deterministic HTML.
- `workspace/` provides the NFC-ready local UI.
