# AI Video Copilot System

The copilot provides deterministic suggestions for script, visuals, pacing, titles, and thumbnails.

## Primary rule

Copilot suggests only — it never mutates source data directly.

## Capabilities

- Suggest stronger opening hooks.
- Suggest visual improvements per scene.
- Suggest pacing/script refinements.
- Suggest title and thumbnail concepts.
- Output all suggestions as deterministic edit commands.

## Output model

- Ranked `suggestions` list.
- Append-only `edit_commands` (`COPILOT-CMD-00001`, ...).
- Stable `copilot_hash` for reproducibility.
