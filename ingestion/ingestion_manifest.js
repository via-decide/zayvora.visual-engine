import crypto from 'node:crypto';

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}

export class IngestionManifest {
  constructor({ runId = null, createdAt = new Date().toISOString(), resources = [], errors = [] } = {}) {
    this.runId = runId;
    this.createdAt = createdAt;
    this.resources = resources;
    this.errors = errors;
    this.manifestHash = sha256(JSON.stringify({ runId, createdAt, resources, errors }));
  }

  toJSON() {
    return {
      runId: this.runId,
      createdAt: this.createdAt,
      resourceCount: this.resources.length,
      errorCount: this.errors.length,
      resources: this.resources,
      errors: this.errors,
      manifestHash: this.manifestHash,
    };
  }
}

export { sha256 };
