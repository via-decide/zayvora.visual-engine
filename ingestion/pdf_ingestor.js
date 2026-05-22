import { sha256 } from './ingestion_manifest.js';

export class PdfIngestor {
  constructor({ pdfTextExtractor } = {}) {
    this.pdfTextExtractor = pdfTextExtractor || (async () => '');
  }

  async ingest({ sourceId, url, buffer, retrievedAt = new Date().toISOString(), metadata = {} }) {
    if (!buffer || !buffer.length) {
      throw new Error('PDF buffer is required for ingestion.');
    }
    const text = await this.pdfTextExtractor(buffer, metadata);
    if (!text || !String(text).trim()) {
      throw new Error('Unable to verify PDF content extraction.');
    }

    return {
      source_id: sourceId,
      url,
      title: metadata.title || '',
      author: metadata.author || '',
      published_at: metadata.publishedAt || '',
      retrieved_at: retrievedAt,
      content_hash: sha256(String(text)),
      source_type: 'pdf',
      text: String(text).trim(),
      domain: (() => { try { return new URL(url).hostname; } catch { return ''; } })(),
    };
  }
}
