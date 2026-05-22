const LOW_QUALITY_PATTERNS = [/\.blogspot\./i, /\.wordpress\./i, /clickbait/i, /spam/i];

export class DomainRanker {
  constructor({ authorityByDomain = {}, blockedDomains = [] } = {}) {
    this.authorityByDomain = authorityByDomain;
    this.blockedDomains = new Set(blockedDomains.map((d) => d.toLowerCase()));
  }

  rank(domain = '') {
    const normalized = String(domain || '').toLowerCase();
    if (!normalized) return { authority: 20, lowQuality: true, blocked: false };
    if (this.blockedDomains.has(normalized)) return { authority: 0, lowQuality: true, blocked: true };

    const direct = this.authorityByDomain[normalized];
    if (typeof direct === 'number') {
      return { authority: Math.max(0, Math.min(100, direct)), lowQuality: direct < 35, blocked: false };
    }

    const lowQuality = LOW_QUALITY_PATTERNS.some((rx) => rx.test(normalized));
    return { authority: lowQuality ? 15 : 55, lowQuality, blocked: false };
  }
}
