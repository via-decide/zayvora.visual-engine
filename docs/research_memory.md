# Research Memory and Reuse

This subsystem makes Nex faster and smarter over time by reusing validated research assets.

## Primary rule

Nex should not re-research the same source unnecessarily.

## Responsibilities

- Cache ingested sources by content hash.
- Index topics and discover related-topic reusable sources.
- Reuse citations across related videos.
- Detect stale sources.
- Refresh outdated resources.
- Track source reuse history.

## Modules

- `memory/research_memory.js` — orchestration of memory writes/reads/reuse decisions.
- `memory/source_cache.js` — hash-keyed source cache with staleness + reuse history tracking.
- `memory/topic_index.js` — topic-to-source hash indexing and related topic lookup.
- `memory/citation_memory.js` — reusable citations keyed by claim fingerprint.
- `memory/reuse_policy.js` — policy gate for source reuse vs refresh.

## Success criteria

Nex becomes faster and smarter over time.
