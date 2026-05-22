import { sha256 } from './ingestion_manifest.js';

export class TranscriptIngestor {
  ingest({ sourceId, url, transcript, retrievedAt = new Date().toISOString(), metadata = {} }) {
    const text = Array.isArray(transcript)
      ? transcript.map((t) => (typeof t === 'string' ? t : t.text || '')).join(' ').trim()
      : String(transcript || '').trim();

    if (!text) {
      throw new Error('Unable to verify transcript content.');
    }

    return {
      source_id: sourceId,
      url,
      title: metadata.title || '',
      author: metadata.author || '',
      published_at: metadata.publishedAt || '',
      retrieved_at: retrievedAt,
      content_hash: sha256(text),
      source_type: 'transcript',
      text,
      domain: (() => { try { return new URL(url).hostname; } catch { return ''; } })(),
    };
  }
}
