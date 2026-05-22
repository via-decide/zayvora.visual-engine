import test from 'node:test';
import assert from 'node:assert/strict';
import { TranscriptIngestor } from '../transcript_ingestor.js';

test('extracts transcript text from segment list', () => {
  const ingestor = new TranscriptIngestor();
  const item = ingestor.ingest({
    sourceId: 'SRC-TR-1',
    url: 'https://youtube.com/watch?v=abc',
    transcript: [{ text: 'Line one.' }, { text: 'Line two.' }],
    retrievedAt: '2026-05-22T00:00:00.000Z',
  });

  assert.equal(item.source_type, 'transcript');
  assert.equal(item.text, 'Line one. Line two.');
  assert.match(item.content_hash, /^sha256:[a-f0-9]{64}$/);
});
