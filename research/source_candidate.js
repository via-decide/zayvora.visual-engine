import crypto from 'node:crypto';

const SOURCE_TYPES = new Set([
  'articles',
  'pdfs',
  'papers',
  'documentation',
  'github_repos',
  'transcripts',
  'datasets',
  'official_pages',
]);

function normalizeSourceType(type = '') {
  const raw = String(type || '').trim().toLowerCase();
  const map = {
    article: 'articles',
    articles: 'articles',
    pdf: 'pdfs',
    pdfs: 'pdfs',
    paper: 'papers',
    papers: 'papers',
    documentation: 'documentation',
    docs: 'documentation',
    github: 'github_repos',
    github_repo: 'github_repos',
    github_repos: 'github_repos',
    transcript: 'transcripts',
    transcripts: 'transcripts',
    dataset: 'datasets',
    datasets: 'datasets',
    official: 'official_pages',
    official_page: 'official_pages',
    official_pages: 'official_pages',
  };

  const normalized = map[raw] || raw;
  return SOURCE_TYPES.has(normalized) ? normalized : 'articles';
}

function stableHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export class SourceCandidate {
  constructor(input = {}) {
    this.provider = String(input.provider || 'unknown');
    this.title = String(input.title || '').trim();
    this.url = String(input.url || '').trim();
    this.snippet = String(input.snippet || '').trim();
    this.publishedAt = input.publishedAt ? new Date(input.publishedAt).toISOString() : null;
    this.sourceType = normalizeSourceType(input.sourceType);
    this.authoritySignals = input.authoritySignals || {};
    this.raw = input.raw || {};
    this.hash = stableHash(`${this.url}|${this.title.toLowerCase()}|${this.provider}`);
  }

  toJSON() {
    return {
      provider: this.provider,
      title: this.title,
      url: this.url,
      snippet: this.snippet,
      publishedAt: this.publishedAt,
      sourceType: this.sourceType,
      authoritySignals: this.authoritySignals,
      raw: this.raw,
      hash: this.hash,
    };
  }
}

export { SOURCE_TYPES, normalizeSourceType, stableHash };
