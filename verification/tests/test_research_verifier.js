import test from 'node:test';
import assert from 'node:assert/strict';
import { ResearchVerifier } from '../research_verifier.js';

test('passes verification when all claims/citations/sources are valid', () => {
  const verifier = new ResearchVerifier();
  const pkg = {
    talking_points: [
      { claim_id: 'CLAIM-001', talking_point: 'Point', verified: true },
    ],
    section_evidence: [
      { claim_id: 'CLAIM-001', evidence: { source_id: 'SRC-001', excerpts: ['evidence text'] } },
    ],
    citations: [
      { claim_id: 'CLAIM-001', source_id: 'SRC-001', excerpts: ['evidence text'] },
    ],
  };

  const ingested = [
    { source_id: 'SRC-001', text: 'This source contains substantial supporting context, methodology notes, measured outcomes, assumptions, limitations, and reference framing to exceed the default density threshold safely.' },
    { source_id: 'SRC-002', text: 'Another source includes technical detail, benchmark setup, comparative observations, sample caveats, and interpretation notes so it also clears minimum source density requirements.' },
  ];

  const report = verifier.verify({ packageData: pkg, ingestedSources: ingested, options: { minSources: 2, minWordsPerSource: 10 } });
  const json = report.toJSON();

  assert.equal(json.verified, true);
  assert.equal(json.ready_for_video, true);
  assert.equal(json.unsupported_claims.length, 0);
  assert.equal(json.weak_sources.length, 0);
  assert.equal(json.citation_coverage, 1);
  assert.doesNotThrow(() => verifier.assertReady(report));
});

test('blocks export when verification fails', () => {
  const verifier = new ResearchVerifier();
  const report = verifier.verify({
    packageData: {
      talking_points: [{ claim_id: 'CLAIM-404', talking_point: 'Unverified claim', verified: false }],
      section_evidence: [],
      citations: [{ claim_id: 'CLAIM-404', source_id: 'SRC-MISSING' }],
    },
    ingestedSources: [{ source_id: 'SRC-001', text: 'short text' }],
    options: { minSources: 2, minWordsPerSource: 20 },
  });

  const json = report.toJSON();
  assert.equal(json.verified, false);
  assert.equal(json.ready_for_video, false);
  assert.ok(json.unsupported_claims.length >= 1);
  assert.ok(json.weak_sources.length >= 1);
  assert.ok(json.citation_coverage < 1);
  assert.throws(() => verifier.assertReady(report), /Verification gate failed/);
});
