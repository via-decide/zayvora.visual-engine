# YouTube Export Package

The YouTube export system assembles a publish-ready package from deterministic render outputs.

## Output artifacts

- `video.mp4`
- `captions.srt`
- `thumbnail.png`
- `metadata.json`
- `description.txt`

## Pipeline

Render result + caption payload
↓
Metadata generator (title + description)
↓
Chapter generator (timeline -> timestamps)
↓
Thumbnail generator (deterministic plan)
↓
SRT exporter
↓
YouTube package manifest

## Guarantees

- Title and description are generated deterministically from context.
- Chapters are derived from frame timeline and fps.
- Thumbnail generation returns a deterministic plan/hash.
- Final package includes deterministic `package_hash`.
