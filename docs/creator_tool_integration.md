# Creator-Tool Video Workflow Bridge

`integrations/creator_bridge.js` maps creator-tool workflows into the shared deterministic visual engine contract.

## What is mapped

- Templates → scene graph (`template_mapper.js`)
- Platforms → render configuration (`platform_mapper.js`)
  - `youtube` = 1920x1080 (16:9)
  - `shorts` = 1080x1920 (9:16)
  - `reels` = 1080x1920 (9:16)
- Scene graph → timeline → render contract

## Guarantees

- Template structure is preserved through stable scene/layer mapping.
- Platform dimensions/fps/format are deterministic.
- Pipeline conversion uses the same contract path as other integrations.
- Compatibility is validated for template preservation + platform contract fit.
