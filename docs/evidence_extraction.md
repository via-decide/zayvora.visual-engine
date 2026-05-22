# Evidence Extraction and Claim Mapping Engine

This engine ensures Nex separates claims from evidence and produces source-grounded outputs.

## Primary rule

Nex must separate claims from evidence.

## Pipeline responsibilities

- Extract claim-like statements from ingested resources.
- Extract supporting excerpts as short evidence quotes.
- Map each claim to supporting `source_id` values.
- Preserve short source excerpts per citation.
- Mark unsupported claims as `verified: false`.
- Build an evidence graph connecting claim nodes to source nodes.

## Modules

- `evidence/evidence_extractor.js` — orchestrates extraction, mapping, and graph build.
- `evidence/claim_extractor.js` — claim sentence detection and claim IDs.
- `evidence/quote_extractor.js` — short excerpt selection per claim/resource pair.
- `evidence/citation_mapper.js` — produces canonical claim mapping format.
- `evidence/evidence_graph.js` — creates claim-source graph structure.

## Claim format

```json
{
  "claim_id": "CLAIM-001",
  "claim": "",
  "source_ids": ["SRC-001"],
  "evidence": [],
  "confidence": 0.0,
  "verified": true
}
```

## Success criteria

Nex can produce source-grounded research instead of loose summaries.
