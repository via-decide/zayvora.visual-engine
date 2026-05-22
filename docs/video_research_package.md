# Video Research Packager

This module converts a research brief into a visual-engine-ready package.

## Primary rule

Nex output must be directly usable by visual-engine.

## Package format

```json
{
  "package_id": "VRP-001",
  "topic": "",
  "video_title_options": [],
  "hook_options": [],
  "talking_points": [],
  "source_cards": [],
  "citations": [],
  "contract_ready": true
}
```

## Components

- `video_research/video_research_packager.js` — transforms brief into package JSON.
- `video_research/video_angle_generator.js` — generates title and hook options.
- `video_research/talking_points_builder.js` — builds talking points + section evidence.
- `video_research/source_card_generator.js` — builds source cards from citations.
- `video_research/video_research_schema.js` — canonical package schema + deterministic hash.

## Produced outputs

- video title options
- hook options
- section-by-section talking points
- source cards for visual reference
- section-by-section evidence links
- citation list passthrough
- contract-ready JSON for downstream pipeline consumption

## Success criteria

Nex can hand off research directly to the video pipeline.
