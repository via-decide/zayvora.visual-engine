# Web Resource Ingestion Pipeline

This pipeline converts internet resources into verified research inputs while preserving provenance.

## Primary rule

Every ingested resource preserves provenance and hash-verifiable content.

## Modules

- `ingestion/web_ingestor.js`: orchestrates fetch + parse for article/pdf/transcript ingestion.
- `ingestion/html_cleaner.js`: removes scripts/styles/tags and normalizes text.
- `ingestion/article_extractor.js`: extracts article-first content from HTML.
- `ingestion/pdf_ingestor.js`: ingests PDF buffers through an extractor and verifies text output.
- `ingestion/transcript_ingestor.js`: normalizes transcript strings/segments into verified text.
- `ingestion/metadata_extractor.js`: extracts title/author/date/domain metadata.
- `ingestion/ingestion_manifest.js`: stores deterministic run manifest with hashes.

## Ingested resource format

```json
{
  "source_id": "SRC-001",
  "url": "",
  "title": "",
  "author": "",
  "published_at": "",
  "retrieved_at": "",
  "content_hash": "sha256:...",
  "source_type": "article|pdf|transcript|repo|paper",
  "text": ""
}
```

## Safety behavior

- If fetch fails, ingestion fails for the resource.
- If extracted text is empty or unverifiable, ingestion fails for the resource.
- Batch ingestion records per-resource errors in the manifest instead of crashing the run.
