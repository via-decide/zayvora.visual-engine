# HTML and Remotion Shared Model

HTML carousel rendering and Remotion video rendering consume the same deterministic render contract.

Principles:

- No duplicate generation logic across renderers.
- Shared source model: prompt -> scene graph -> timeline -> render contract.
- Renderers are adapters only (`html`, `remotion`, `json`, `preview`).
- Deterministic hashes verify identical upstream model for both render targets.
