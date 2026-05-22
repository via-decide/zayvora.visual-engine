import test from 'node:test';
import assert from 'node:assert/strict';
import { WebIngestor } from '../web_ingestor.js';

test('ingests article and preserves provenance fields', async () => {
  const fakeFetch = async () => ({
    ok: true,
    async text() {
      return `
        <html><head>
          <title>Web Ingestion</title>
          <meta name="author" content="Nex Team" />
          <meta property="article:published_time" content="2026-05-20" />
        </head>
        <body><article><h1>Hello</h1><p>Verified research text.</p></article></body></html>`;
    },
  });

  const ingestor = new WebIngestor({ fetchImpl: fakeFetch });
  const item = await ingestor.ingestResource({ sourceId: 'SRC-001', url: 'https://example.org/page', sourceType: 'article', retrievedAt: '2026-05-22T00:00:00.000Z' });

  assert.equal(item.source_id, 'SRC-001');
  assert.equal(item.title, 'Web Ingestion');
  assert.equal(item.author, 'Nex Team');
  assert.equal(item.published_at, '2026-05-20');
  assert.equal(item.domain, 'example.org');
  assert.match(item.content_hash, /^sha256:[a-f0-9]{64}$/);
});

test('fails safely when content cannot be verified', async () => {
  const fakeFetch = async () => ({ ok: true, async text() { return '<html><body></body></html>'; } });
  const ingestor = new WebIngestor({ fetchImpl: fakeFetch });

  await assert.rejects(
    () => ingestor.ingestResource({ sourceId: 'SRC-ERR', url: 'https://example.org/empty', sourceType: 'article' }),
    /Unable to verify article content extraction/,
  );
});
