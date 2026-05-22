import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceDiscoveryEngine } from '../source_discovery_engine.js';
import { SearchProviderRegistry } from '../search_provider_registry.js';

test('discovers, deduplicates, and filters low quality sources', async () => {
  const registry = new SearchProviderRegistry();
  registry.registerProvider('docsProvider', {
    async search() {
      return [
        { title: 'Official API Docs', url: 'https://example.com/docs', sourceType: 'documentation', authoritySignals: { domainAuthority: 80 }, snippet: 'api reference guide' },
        { title: 'Official API Docs', url: 'https://example.com/docs', sourceType: 'documentation', authoritySignals: { domainAuthority: 80 }, snippet: 'duplicate' },
      ];
    },
  });
  registry.registerProvider('spamProvider', {
    async search() {
      return [{ title: 'Clickbait', url: 'https://spam.site', sourceType: 'articles', authoritySignals: { domainAuthority: 5 }, snippet: 'buy now wow' }];
    },
  });

  const engine = new SourceDiscoveryEngine({ registry, lowQualityThreshold: 55 });
  const manifest = await engine.discover('How does the API work?');

  assert.equal(manifest.sources.length, 1);
  assert.equal(manifest.sources[0].url, 'https://example.com/docs');
  assert.equal(manifest.inputType, 'question');
});
