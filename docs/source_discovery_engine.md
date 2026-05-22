# Source Discovery Engine

`SourceDiscoveryEngine` is Nex's NotebookLM-independent research intake layer.

## Capabilities

- Accepts a **topic, URL, document, or question** and infers input type.
- Queries every configured provider through `SearchProviderRegistry`.
- Normalizes candidates into `SourceCandidate` records across source types:
  - articles
  - PDFs
  - papers
  - documentation
  - GitHub repos
  - transcripts
  - datasets
  - official pages
- Ranks candidates on:
  - authority
  - freshness
  - relevance
  - citation value
- Rejects duplicates by deterministic source hash.
- Rejects low-quality candidates via threshold filtering.
- Emits deterministic `SourceManifest` output with global manifest hash.

## Module map

- `research/source_discovery_engine.js` — orchestration.
- `research/search_provider_registry.js` — provider registration and fan-out querying.
- `research/source_candidate.js` — normalization, type coercion, source hash.
- `research/source_ranker.js` — weighted ranking and quality gating.
- `research/source_manifest.js` — manifest serialization + integrity hash.

## Basic usage

```js
import { SourceDiscoveryEngine } from './research/source_discovery_engine.js';
import { SearchProviderRegistry } from './research/search_provider_registry.js';

const registry = new SearchProviderRegistry();
registry.registerProvider('web-search', {
  async search(query) {
    return [
      {
        title: 'Official docs',
        url: 'https://vendor.example/docs',
        sourceType: 'documentation',
        snippet: `docs for ${query}`,
        authoritySignals: { domainAuthority: 90 },
      },
    ];
  },
});

const engine = new SourceDiscoveryEngine({ registry });
const manifest = await engine.discover('best sources for llm video topic research');
console.log(manifest.toJSON());
```

This enables Nex to gather high-value source material for a YouTube video topic without Google NotebookLM.
