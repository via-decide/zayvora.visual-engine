export class CitationMemory {
  constructor() {
    this.byClaimFingerprint = new Map();
  }

  fingerprint(claim = '') {
    return String(claim).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  remember({ claim, citationRow }) {
    const key = this.fingerprint(claim);
    if (!key || !citationRow) return;
    if (!this.byClaimFingerprint.has(key)) this.byClaimFingerprint.set(key, []);
    this.byClaimFingerprint.get(key).push(citationRow);
  }

  reuseForClaim(claim) {
    const key = this.fingerprint(claim);
    return [...(this.byClaimFingerprint.get(key) || [])];
  }
}
