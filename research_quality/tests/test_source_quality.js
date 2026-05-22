import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceQualityScorer } from '../source_quality_scorer.js';

test('prefers primary sources and scores all quality dimensions', () => {
  const scorer = new SourceQualityScorer();
  const ranked = scorer.rank([
    {
      source_id: 'SRC-ART',
      sourceType: 'articles',
      url: 'https://news-blog.blogspot.com/post',
      domain: 'news-blog.blogspot.com',
      title: 'Opinion on AI',
      snippet: 'ai opinion',
      publishedAt: '2026-05-20',
      text: 'Short commentary only',
    },
    {
      source_id: 'SRC-OFF',
      sourceType: 'official_pages',
      url: 'https://openai.com/research',
      domain: 'openai.com',
      title: 'Official research update',
      snippet: 'AI research publication',
      publishedAt: '2026-05-21',
      text: 'Detailed primary source text '.repeat(80),
    },
  ], { query: 'ai research update', now: new Date('2026-05-22T00:00:00.000Z') });

  assert.equal(ranked[0].source_id, 'SRC-OFF');
  assert.equal(ranked[0].quality.is_primary_source, true);
  assert.equal(ranked[1].quality.low_quality_domain, true);
  assert.ok(ranked[0].quality.total > ranked[1].quality.total);
});
