import { sha256, IngestionManifest } from './ingestion_manifest.js';
import { extractMetadataFromHtml } from './metadata_extractor.js';
import { extractArticleText } from './article_extractor.js';
import { PdfIngestor } from './pdf_ingestor.js';
import { TranscriptIngestor } from './transcript_ingestor.js';

export class WebIngestor {
  constructor({ fetchImpl = fetch, pdfIngestor = new PdfIngestor(), transcriptIngestor = new TranscriptIngestor() } = {}) {
    this.fetchImpl = fetchImpl;
    this.pdfIngestor = pdfIngestor;
    this.transcriptIngestor = transcriptIngestor;
  }

  async ingestResource({ sourceId, url, sourceType, transcript = null, retrievedAt = new Date().toISOString() }) {
    if (!url || !sourceId) throw new Error('sourceId and url are required.');

    if (sourceType === 'transcript') {
      return this.transcriptIngestor.ingest({ sourceId, url, transcript, retrievedAt, metadata: {} });
    }

    const response = await this.fetchImpl(url);
    if (!response?.ok) {
      throw new Error(`Failed to fetch resource: ${url}`);
    }

    if (sourceType === 'pdf') {
      const arrayBuffer = await response.arrayBuffer();
      return this.pdfIngestor.ingest({ sourceId, url, buffer: Buffer.from(arrayBuffer), retrievedAt, metadata: {} });
    }

    const html = await response.text();
    const metadata = extractMetadataFromHtml(html, url);
    const text = extractArticleText(html);
    if (!text) {
      throw new Error('Unable to verify article content extraction.');
    }

    return {
      source_id: sourceId,
      url,
      title: metadata.title,
      author: metadata.author,
      published_at: metadata.publishedAt,
      retrieved_at: retrievedAt,
      content_hash: sha256(text),
      source_type: sourceType || 'article',
      text,
      domain: metadata.domain,
    };
  }

  async ingestBatch(resources, options = {}) {
    const ingested = [];
    const errors = [];

    for (const resource of resources) {
      try {
        ingested.push(await this.ingestResource(resource));
      } catch (error) {
        errors.push({ sourceId: resource.sourceId, url: resource.url, reason: error.message });
      }
    }

    return new IngestionManifest({
      runId: options.runId || null,
      createdAt: options.createdAt || new Date().toISOString(),
      resources: ingested,
      errors,
    });
  }
}
