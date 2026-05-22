import crypto from 'node:crypto';

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value)).digest('hex')}`;
}

export class VerificationReport {
  constructor({ verified, unsupportedClaims, weakSources, citationCoverage, readyForVideo, details = {} }) {
    this.verified = Boolean(verified);
    this.unsupported_claims = unsupportedClaims || [];
    this.weak_sources = weakSources || [];
    this.citation_coverage = citationCoverage;
    this.ready_for_video = Boolean(readyForVideo);
    this.details = details;
    this.report_hash = sha256(JSON.stringify(this.toJSONCore()));
  }

  toJSONCore() {
    return {
      verified: this.verified,
      unsupported_claims: this.unsupported_claims,
      weak_sources: this.weak_sources,
      citation_coverage: this.citation_coverage,
      ready_for_video: this.ready_for_video,
      details: this.details,
    };
  }

  toJSON() {
    return { ...this.toJSONCore(), report_hash: this.report_hash };
  }
}
