import { DomainRanker } from './domain_ranker.js';
import { FreshnessScorer } from './freshness_scorer.js';
import { TrustPolicy } from './trust_policy.js';

function relevanceScore(source, query = '') {
  const tokens = String(query)
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2);
  if (!tokens.length) return 50;
  const text = `${source.title || ''} ${source.snippet || ''} ${source.text || ''}`.toLowerCase();
  const hits = tokens.filter((t) => text.includes(t)).length;
  return Math.min(100, Math.round((hits / tokens.length) * 100));
}

function evidenceDensity(source) {
  const text = String(source.text || source.snippet || '');
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words >= 800) return 95;
  if (words >= 300) return 80;
  if (words >= 120) return 65;
  if (words >= 40) return 50;
  return 30;
}

export class SourceQualityScorer {
  constructor({ domainRanker = new DomainRanker(), freshnessScorer = new FreshnessScorer(), trustPolicy = new TrustPolicy() } = {}) {
    this.domainRanker = domainRanker;
    this.freshnessScorer = freshnessScorer;
    this.trustPolicy = trustPolicy;
  }

  score(source, context = {}) {
    const domain = source.domain || (() => { try { return new URL(source.url).hostname; } catch { return ''; } })();
    const domainRank = this.domainRanker.rank(domain);
    const freshness = this.freshnessScorer.score(source.publishedAt || source.published_at, context.now || new Date());
    const relevance = relevanceScore(source, context.query || '');
    const density = evidenceDensity(source);
    const trust = this.trustPolicy.evaluate(source);

    const authority = domainRank.authority;
    const lowQualityDomain = domainRank.lowQuality || domainRank.blocked;

    const total =
      authority * 0.25 +
      freshness * 0.15 +
      relevance * 0.2 +
      density * 0.15 +
      trust.sourceTypeScore * 0.15 +
      trust.citationUsefulness * 0.1;

    return {
      ...source,
      quality: {
        authority,
        freshness,
        relevance,
        evidence_density: density,
        source_type: trust.sourceTypeScore,
        citation_usefulness: trust.citationUsefulness,
        low_quality_domain: lowQualityDomain,
        is_primary_source: trust.isPrimary,
        total: Number(total.toFixed(2)),
      },
    };
  }

  rank(sources = [], context = {}) {
    return sources
      .map((source) => this.score(source, context))
      .sort((a, b) => {
        if (a.quality.low_quality_domain !== b.quality.low_quality_domain) {
          return a.quality.low_quality_domain ? 1 : -1;
        }
        if (a.quality.is_primary_source !== b.quality.is_primary_source) {
          return a.quality.is_primary_source ? -1 : 1;
        }
        return b.quality.total - a.quality.total;
      });
  }
}

export { relevanceScore, evidenceDensity };
