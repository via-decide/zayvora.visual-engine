# Research Verification Gate

This gate validates research packages before video generation.

## Primary rule

No unsupported claim enters the video pipeline.

## Responsibilities

- Verify every talking point has evidence.
- Verify every citation maps to an ingested source.
- Detect unsupported claims.
- Detect weak source coverage.
- Generate verification report.
- Block export when verification fails.

## Verification result format

```json
{
  "verified": true,
  "unsupported_claims": [],
  "weak_sources": [],
  "citation_coverage": 1.0,
  "ready_for_video": true
}
```

## Modules

- `verification/research_verifier.js` — orchestrates all checks and enforces export gating.
- `verification/citation_verifier.js` — validates citation source IDs against ingested sources.
- `verification/unsupported_claim_detector.js` — flags claims without verified evidence.
- `verification/source_coverage_checker.js` — checks source-count and source-density strength.
- `verification/verification_report.js` — canonical report with deterministic hash.

## Success criteria

Nex prevents hallucinated video scripts.
