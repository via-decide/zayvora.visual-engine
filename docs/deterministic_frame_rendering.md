# Deterministic Frame Rendering

Deterministic frame rendering in Zayvora Remotion adapter means:

- Scene selection is computed from fixed timeline segment frame ranges.
- Transition progress is computed from exact integer frame arithmetic.
- Layer renderers have fixed defaults (font stack, dimensions, fit, easing).
- No runtime random values or hidden mutable state are used.
- Same input + same frame always yields identical frame model output.
