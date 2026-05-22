import { stableHash } from './source_candidate.js';

export class SourceManifest {
  constructor({ query, inputType, createdAt = new Date().toISOString(), sources = [] }) {
    this.query = query;
    this.inputType = inputType;
    this.createdAt = createdAt;
    this.sources = sources;
    this.hash = stableHash(JSON.stringify({ query, inputType, createdAt, sources }));
  }

  toJSON() {
    return {
      query: this.query,
      inputType: this.inputType,
      createdAt: this.createdAt,
      hash: this.hash,
      sourceCount: this.sources.length,
      sources: this.sources,
    };
  }
}
