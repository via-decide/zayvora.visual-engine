# Captions / Subtitle System

The caption system generates deterministic subtitle tracks from narration output.

## Flow

Narration Script
↓
Caption Generator
↓
Caption Timeline (synced timestamps)
↓
SRT Export / VTT Export
↓
Burned-caption ready payload

## Features

- Generate captions from narration text and scene timing.
- Sync timestamps deterministically (`start_sec`, `end_sec`).
- Validate timing continuity (no gaps/overlaps).
- Export to SRT and VTT formats.
- Mark payload as burned-caption compatible.

## Determinism

- Caption timeline is derived only from narration duration order.
- Caption payload includes deterministic `caption_hash`.
- Re-running on identical narration produces identical SRT/VTT content.
