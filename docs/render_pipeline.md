# Final Render Pipeline (Remotion + FFmpeg)

The final renderer composes deterministic video output by combining visual frames, narration audio, and captions.

## Flow

Render Contract + Scene Graph + Timeline
↓
Remotion Adapter (frame rendering)
↓
FFmpeg Audio Merge
↓
FFmpeg Caption Burn
↓
MP4 Export
↓
Render Manifest Hash Verification

## Components

- `render/remotion_adapter.js` — deterministic frame rendering from visual contract.
- `render/ffmpeg_pipeline.js` — deterministic audio merge and caption burn command planning.
- `render/audio_video_muxer.js` — orchestration of merge + burn + export.
- `render/video_renderer.js` — end-to-end final render runner.
- `render/render_manifest.js` — render manifest + hash verification.

## Guarantees

- Frame output is deterministic for identical contracts.
- Audio is merged per scene audio manifest timeline.
- Captions can be burned into exported MP4.
- Final output manifest includes deterministic hash validation.
