# NEX Integration Verification

## Verdict: PASS

NEX handoff input can enter the current Zayvora Visual Engine pipeline, reach the final artifact layer, and produce a deterministic repository-defined HTML slide artifact. During invalid-input testing I found two integration validation defects: unsupported `schema_version` and duplicate IDs were accepted. I made the minimal adapter/contract validation repair and reran the full matrix.

## Recent integration

Relevant recent git history:

| Commit | Evidence |
| --- | --- |
| `abbbef6` | Merge pull request `#16` from `codex/integrate-nex-with-zayvora-visual-engine-2026-07-14`. |
| `b222e87` | `Add Nex research handoff visual pipeline`. Changed `app/api/generate/route.js`, `docs/nex_research_visual_handoff_contract.md`, `integrations/nex_visual_handoff_contract.js`, `pipeline/visual_pipeline.js`, and `tests/nex_handoff_acceptance.mjs`. |
| `10eff19` | `Connect visual engine artifact pipeline`, prior visual-engine output wiring. |

I attempted to clone the integration dependency with `git clone https://github.com/via-decide/nex.git /workspace/nex`, but network access to GitHub returned `CONNECT tunnel failed, response 403`. Therefore the external `via-decide/nex` repository itself could not be inspected in this environment. The verification uses repository evidence present in `zayvora.visual-engine`: docs, tests, adapter code, and producer-shaped examples.

## Architecture: literal NEX → Zayvora execution map

```text
NEX SOURCE
  ↓
NEX OUTPUT CONTRACT
  ↓
ZAYVORA ENTRY POINT
  ↓
NORMALIZATION / ADAPTER
  ↓
VISUAL ENGINE STATE
  ↓
EXECUTION
  ↓
RENDER / ARTIFACT
```

| Block | Actual file | Exported symbol / route | Evidence |
| --- | --- | --- | --- |
| NEX SOURCE | `tests/nex_handoff_acceptance.mjs` | test producer object passed to `createNexVisualHandoff` | Repository-supported fixture-like producer for three research questions. |
| NEX OUTPUT CONTRACT | `integrations/nex_visual_handoff_contract.js` | `createNexVisualHandoff(input)` | Builds `contract_type: "nex.visual_handoff"`, `schema_version: "1.0.0"`, canonical fields, and deterministic `handoff_id`. |
| ZAYVORA ENTRY POINT | `app/api/generate/route.js` | `POST(req)` | Branches on `body.nex_handoff` and invokes NEX path; otherwise canonical prompt path. |
| NORMALIZATION / ADAPTER | `integrations/nex_visual_handoff_contract.js` | `normalizeFinding`, `normalizeEvidence`, `normalizeSourceReference`, `selectHandoffFindings` | Normalizes aliases such as `id`, `summary`, `text`, `evidence`, `source`, verifies confidence and evidence linkage, rejects bad states. |
| VISUAL ENGINE STATE | `pipeline/visual_pipeline.js` | `interpretNexResearchHandoff(handoff)` | Converts handoff to `intent` with `entry_type: "nex_research_handoff"` and supported claim lineage. |
| EXECUTION | `pipeline/visual_pipeline.js` | `runNexResearchHandoffPipeline(handoff, config)` | Runs research interpretation → narrative → slide specification → scene graph → timeline → render contract → artifact. |
| RENDER / ARTIFACT | `pipeline/visual_pipeline.js` | `renderSlides(slideSpec)` | Produces repository-defined final artifact `{ stage: "artifact", renderer: "html", slides, slide_count, complete, artifact_hash }`. |

## Contract: real NEX input schema / payload

The repository evidence defines a structured NEX visual handoff, not a vague prompt. Required fields are implemented in `createNexVisualHandoff`:

- `research_id`
- `title`
- `original_question`
- `executive_summary`
- `verified_findings[]`
- `evidence_items[]` or `evidence[]`
- `source_references[]`
- `concept_relationships[]`
- `visual_objective`
- `audience`
- `artifact_type`
- optional `selected_finding_id`
- optional `schema_version`, now accepted only as `1.0.0`

The valid E2E payload was based on `tests/nex_handoff_acceptance.mjs`, specifically its `Why do APIs fail at scale?` case and its fields: research identity, title, original question, executive summary, verified findings with `VERIFIED` / `LIKELY` confidence, evidence IDs, evidence items, source references, visual objective, audience, and artifact type.

## Baseline: pre-change build and test results

Commands run before modifying code:

| Command | Exit code | Result |
| --- | ---: | --- |
| `npm run build` | `0` | Next.js production build succeeded. Warning: `npm warn Unknown env config "http-proxy"`. |
| `for f in $(find . -path './node_modules' -prune -o -path './.git' -prune -o -path './ui/node_modules' -prune -o -name 'test_*.js' -print \| sort) tests/*.mjs; do [ -f "$f" ] \|\| continue; node "$f"; echo TEST_EXIT:$?:$f; done` | `0` | All discovered JS tests and `tests/nex_handoff_acceptance.mjs` passed. |

## E2E test

Command:

```bash
node .codex/nex_verify.mjs
```

Valid input execution wrote:

- `outputs/nex-verification/valid-nex-result.json`
- `outputs/nex-verification/determinism.json`
- `outputs/nex-verification/failure-matrix.json`
- `outputs/nex-verification/non-nex-result.json`

Valid result summary:

```json
{
  "artifact_hash": "sha256:81e60eee653576d16f632266f2bb67a38d165ca899a0228697a3f03ed70c72dd",
  "slide_count": 8,
  "path": "outputs/nex-verification/valid-nex-result.json"
}
```

## Result: output / artifact validation

The NEX handoff reached the final result layer. Validation evidence from `outputs/nex-verification/valid-nex-result.json`:

- `status`: `success`
- `intent.entry_type`: `nex_research_handoff`
- `artifact.stage`: `artifact`
- `artifact.renderer`: `html`
- `artifact.complete`: `true`
- `artifact.slide_count`: `8`
- `artifact.slides`: 8 visible HTML-slide records
- `artifact.artifact_hash`: `sha256:81e60eee653576d16f632266f2bb67a38d165ca899a0228697a3f03ed70c72dd`

This is a repository-defined final visual output: a deterministic HTML slide artifact, not merely parsed input.

## Determinism

Three repeated executions of the same valid NEX input produced equivalent output:

| Run | Handoff ID | Scene graph hash | Timeline hash | Artifact hash | Slide count |
| --- | --- | --- | --- | --- | ---: |
| 1 | `NEX-HANDOFF-B14EC0C3` | `sha256:292d893a903bd9b0b58e214afd5a23203e40595b3ed83ba842847cde8b547f78` | `sha256:0ccd9718fab5059c5f3c48220b2e5eacba7e73a4ab4d802cebe1604075ce20a6` | `sha256:81e60eee653576d16f632266f2bb67a38d165ca899a0228697a3f03ed70c72dd` | 8 |
| 2 | `NEX-HANDOFF-B14EC0C3` | `sha256:292d893a903bd9b0b58e214afd5a23203e40595b3ed83ba842847cde8b547f78` | `sha256:0ccd9718fab5059c5f3c48220b2e5eacba7e73a4ab4d802cebe1604075ce20a6` | `sha256:81e60eee653576d16f632266f2bb67a38d165ca899a0228697a3f03ed70c72dd` | 8 |
| 3 | `NEX-HANDOFF-B14EC0C3` | `sha256:292d893a903bd9b0b58e214afd5a23203e40595b3ed83ba842847cde8b547f78` | `sha256:0ccd9718fab5059c5f3c48220b2e5eacba7e73a4ab4d802cebe1604075ce20a6` | `sha256:81e60eee653576d16f632266f2bb67a38d165ca899a0228697a3f03ed70c72dd` | 8 |

## Failure handling

After the minimal validation fix, all invalid-input cases fail explicitly:

| Case | Result | Error |
| --- | --- | --- |
| Missing required NEX field | explicit failure | `MISSING_RESEARCH_ID` |
| Malformed value | explicit failure | `UNSUPPORTED_FINDING_CONFIDENCE:F1` |
| Unknown node/entity/type | explicit failure | `SELECTED_FINDING_CANNOT_BE_RESOLVED` |
| Empty input | explicit failure | `NO_FINDINGS_EXIST` |
| Unsupported NEX version | explicit failure | `UNSUPPORTED_NEX_HANDOFF_VERSION:9.9.9` |
| Duplicate input | explicit failure | `DUPLICATE_FINDING_ID:F1` |
| Partial input | explicit failure | `UNRESOLVED_EVIDENCE:F1:E1` |

## Regression: existing non-NEX path

Command coverage in `.codex/nex_verify.mjs` also ran:

```js
runCanonicalVisualPipeline('why APIs fail at scale')
```

Result from `outputs/nex-verification/non-nex-result.json`:

```json
{
  "status": "success",
  "artifact_hash": "sha256:f006107276028f2f40aa8e4e935a09259ef1cc07873d1099b87c1a00a636c130",
  "slide_count": 7,
  "contract_hash": "sha256:422b5b5a657d1c24e0d5848281d6201f14504eb363a60381a2bcda325dc7b01e"
}
```

Existing non-NEX prompt execution still produces a complete artifact.

## Fixes

Minimal repair applied in `integrations/nex_visual_handoff_contract.js`:

1. Added `SUPPORTED_SCHEMA_VERSION = "1.0.0"` and explicit rejection for unsupported provided `schema_version`.
2. Added duplicate ID rejection for `verified_findings`, `evidence_items`, and `source_references`.

Reason: failure testing showed unsupported version and duplicate input could silently produce artifacts, which violated acceptance criteria.

## Post-fix complete test matrix

| Command | Exit code | Result |
| --- | ---: | --- |
| `node .codex/nex_verify.mjs` | `0` | Valid E2E, determinism, failure handling, and non-NEX regression passed. |
| `npm run build` | `0` | Next.js production build succeeded. Warning: `npm warn Unknown env config "http-proxy"`. |
| `for f in $(find . -path './node_modules' -prune -o -path './.git' -prune -o -path './ui/node_modules' -prune -o -name 'test_*.js' -print \| sort) tests/*.mjs; do [ -f "$f" ] \|\| continue; node "$f"; echo TEST_EXIT:$?:$f; done` | all test invocations `0` | All discovered tests and `tests/nex_handoff_acceptance.mjs` passed. |
