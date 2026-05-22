const MS_PER_DAY = 24 * 60 * 60 * 1000;

function scoreAuthority(candidate) {
  const domain = candidate.authoritySignals?.domainAuthority || 0;
  const official = candidate.sourceType === 'official_pages' ? 20 : 0;
  const peerReviewed = candidate.sourceType === 'papers' ? 15 : 0;
  return Math.min(100, domain + official + peerReviewed);
}

function scoreFreshness(candidate, now = new Date()) {
  if (!candidate.publishedAt) return 30;
  const ageDays = Math.max(0, (now.getTime() - new Date(candidate.publishedAt).getTime()) / MS_PER_DAY);
  if (ageDays <= 7) return 100;
  if (ageDays <= 30) return 85;
  if (ageDays <= 180) return 60;
  if (ageDays <= 365) return 40;
  return 20;
}

function scoreRelevance(candidate, tokens = []) {
  const text = `${candidate.title} ${candidate.snippet}`.toLowerCase();
  const hits = tokens.filter((t) => text.includes(t)).length;
  if (!tokens.length) return 50;
  return Math.min(100, Math.round((hits / tokens.length) * 100));
}

function scoreCitationValue(candidate) {
  const typedBonus = {
    papers: 95,
    documentation: 85,
    official_pages: 90,
    datasets: 88,
    pdfs: 70,
    github_repos: 75,
    transcripts: 65,
    articles: 60,
  };
  return typedBonus[candidate.sourceType] || 50;
}

export class SourceRanker {
  rank(candidates, queryText, options = {}) {
    const now = options.now || new Date();
    const tokens = String(queryText || '')
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token && token.length > 2 && !new Set(['the','and','for','how','does','what','with']).has(token));

    return candidates
      .map((candidate) => {
        const authority = scoreAuthority(candidate);
        const freshness = scoreFreshness(candidate, now);
        const relevance = scoreRelevance(candidate, tokens);
        const citationValue = scoreCitationValue(candidate);
        const total = authority * 0.3 + freshness * 0.2 + relevance * 0.3 + citationValue * 0.2;

        return {
          ...candidate,
          scores: { authority, freshness, relevance, citationValue, total: Number(total.toFixed(2)) },
        };
      })
      .sort((a, b) => b.scores.total - a.scores.total);
  }

  isLowQuality(candidate, threshold = 55) {
    return candidate.scores.total < threshold;
  }
}
