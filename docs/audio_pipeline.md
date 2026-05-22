# Audio / TTS Pipeline

The deterministic audio pipeline generates per-scene narration audio from storyboard input.

## Flow

Storyboard
↓
Narration Script Compiler
↓
TTS Engine (per scene)
↓
Audio Renderer
↓
Audio Manifest + Timeline
↓
Audio Hashes

## Guarantees

- TTS voice selection is deterministic through `voice_registry`.
- Audio is generated per scene with stable `audio_path` and `audio_hash`.
- Duration is estimated consistently and tracked in seconds.
- Audio timeline is built with deterministic `start_sec`/`end_sec` offsets.
- Final manifest includes `audio_manifest_hash` for reproducibility.
