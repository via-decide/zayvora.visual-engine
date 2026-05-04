class OutputContract {
  constructor({ files = [], allowedExtensions = [], constraints = {} }) {
    this.files = files;
    this.allowedExtensions = allowedExtensions;
    this.constraints = {
      max_images: normalizePositiveInt(constraints.max_images, 12),
      resolution: normalizePositiveInt(constraints.resolution, 1024),
      latency_bound_ms: normalizePositiveInt(constraints.latency_bound_ms, 3000)
    };
    Object.freeze(this.constraints);
    Object.freeze(this);
  }

  isValidFile(file) {
    return this.files.includes(file);
  }

  isValidExtension(file) {
    return this.allowedExtensions.some(ext => file.endsWith(ext));
  }

  areArtifactsAllowed(artifacts) {
    return artifacts.every((artifact) => this.isValidFile(artifact.name) && this.isValidExtension(artifact.name));
  }

  validateConstraints(count) {
    if (count > this.constraints.max_images) {
      throw new Error(`CONSTRAINT_MAX_IMAGES_EXCEEDED: ${count}`);
    }
    return true;
  }
}

function normalizePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

module.exports = { OutputContract };
