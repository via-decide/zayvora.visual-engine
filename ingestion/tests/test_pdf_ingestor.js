import test from 'node:test';
import assert from 'node:assert/strict';
import { PdfIngestor } from '../pdf_ingestor.js';

test('extracts verified pdf text with provenance', async () => {
  const ingestor = new PdfIngestor({
    pdfTextExtractor: async () => 'Paper text from pdf.',
  });

  const item = await ingestor.ingest({
    sourceId: 'SRC-PDF-1',
    url: 'https://example.org/file.pdf',
    buffer: Buffer.from('%PDF-mock'),
    retrievedAt: '2026-05-22T00:00:00.000Z',
    metadata: { title: 'A Paper', author: 'Researcher', publishedAt: '2025-12-01' },
  });

  assert.equal(item.source_type, 'pdf');
  assert.equal(item.title, 'A Paper');
  assert.match(item.content_hash, /^sha256:[a-f0-9]{64}$/);
});
