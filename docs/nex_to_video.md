# Nex Research to Video Bridge

`integrations/nex_bridge.js` connects Nex research output to the deterministic visual video pipeline.

## Flow

NEX OUTPUT (`claims`, `sources`, `sections`)
↓
`nex_parser` (parse + citation extraction)
↓
`nex_normalizer` (normalize claims/sections)
↓
video beats generation
↓
prompt synthesis
↓
visual generation engine (shared deterministic contract)
↓
`nex_contract_mapper` (ecosystem contract mapping + hash)

## Guarantees

- Claims, sections, and sources are parsed deterministically.
- Citations are preserved into the research output + storyboard beats.
- Result maps into canonical ecosystem contract with `source: "nex"`.
- Final mapped output is deterministically hashed.
