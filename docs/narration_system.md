# Narration System

The narration compiler converts storyboard scenes into deterministic narration script lines.

## Flow

Storyboard
↓
Narration Planner
↓
Pacing Engine
↓
Voice Direction
↓
Script Compiler
↓
Narration Hash

## Script line format

```json
{
  "scene_id": "",
  "text": "",
  "duration_sec": 0,
  "tone": "",
  "pause_points": []
}
```

## Guarantees

- Storyboard scenes are converted deterministically.
- Pause points are derived from punctuation boundaries.
- Duration is estimated consistently from text length.
- Tone is normalized to stable categories.
- Final compiled script includes a deterministic narration hash.
