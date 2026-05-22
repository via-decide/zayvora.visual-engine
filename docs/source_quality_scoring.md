# Source Quality Scoring and Trust Ranking

This module helps Nex decide which sources are worth using in a YouTube script.

## Primary rule

Not all sources are equal.

## Scoring dimensions

- authority
- freshness
- relevance
- evidence density
- source type
- citation usefulness

## Components

- `research_quality/source_quality_scorer.js` — computes multi-factor quality scores and ranking.
- `research_quality/trust_policy.js` — codifies preference for primary sources over commentary.
- `research_quality/domain_ranker.js` — detects low-quality domains and maps domain authority.
- `research_quality/freshness_scorer.js` — calculates recency-based freshness score.
- `research_quality/contradiction_detector.js` — flags contradictory claim pairs.

## Behavior

- Prefer primary sources (`official_pages`, `documentation`, `papers`, `datasets`, `github_repos`) over commentary.
- Penalize low-quality or blocked domains.
- Score recency using `publishedAt` / `published_at` when available.
- Include evidence density and citation usefulness in final trust score.
- Detect and return contradictions between claims with high token overlap and opposite polarity.

## Success criteria

Nex can decide which sources are worth using in a YouTube script.
