# Nex Research Visual Handoff Contract

This repository accepts Nex research as a **structured research handoff**, not as a vague prompt. The responsibility boundary is:

```text
USER QUESTION
  ↓
NEX RESEARCH
  ↓
VERIFIED FINDINGS
  ↓
RESEARCH REPORT
  ↓
VISUAL HANDOFF
  ↓
COMMUNICATION INTENT
  ↓
VISUAL NARRATIVE
  ↓
SLIDE SPECIFICATION
  ↓
DETERMINISTIC RENDER
  ↓
FINAL VISUAL ARTIFACT
```

## Responsibilities

| System | Sole responsibility |
| --- | --- |
| Nex | Research, synthesis, verification, knowledge-graph relationships, evidence lineage |
| Visual Handoff | Transfer structured research context and requested communication outcome |
| Zayvora Visual Engine | Interpret research context into communication intent, visual narrative, slide specification, deterministic render, and artifact |

Nex must not design slides. Zayvora must not independently research the topic again.

## Canonical handoff fields

The canonical handoff is implemented by `integrations/nex_visual_handoff_contract.js` with `contract_type: "nex.visual_handoff"`.

| Field | Responsibility |
| --- | --- |
| `research_id` | Source Nex research identity |
| `title` | Research topic |
| `original_question` | User's initial question |
| `executive_summary` | Nex synthesis |
| `verified_findings` | Evidence-backed claims only |
| `finding_confidence` | `VERIFIED` or `LIKELY` state per finding |
| `concept_relationships` | Knowledge-graph relationships relevant to the visual explanation |
| `evidence_items` | Evidence item records used by findings |
| `source_references` | Evidence lineage source records |
| `visual_objective` | Requested communication outcome |
| `audience` | Intended viewer |
| `artifact_type` | Visual artifact intent |

The handoff must not include slide layout, typography, coordinates, or styling. Zayvora owns those decisions.

## Entry types

Zayvora now supports two valid entries:

```text
ENTRY A: Vague Prompt
  ↓
Prompt Enrichment / canonical visual pipeline

ENTRY B: Nex Research Handoff
  ↓
Research Context Interpretation
  ↓
Shared Communication Intent
  ↓
Narrative
  ↓
Slide JSON
  ↓
Renderer
```

Nex handoffs bypass prompt enrichment because structured research is already enriched context.

## Evidence lineage

Internally, each slide can carry:

```text
Slide
  ↓
Narrative Claim
  ↓
Nex Finding ID
  ↓
Evidence Item
  ↓
Source Reference
```

The rendered slide does not need to show every citation by default, but artifact state retains `claim_ids`, `finding_id`, and `evidence_ids`. Unsupported rewritten claims must be marked with `unsupported: true` instead of silently presented as verified research.

## Failure handling

The handoff and pipeline reject incomplete or unsafe states, including missing research identity, missing findings, unresolved selected findings, missing evidence, zero supported claims, empty narrative, invalid slide specifications, and success without rendered slides.
