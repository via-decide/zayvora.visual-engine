import test from 'node:test';
import assert from 'node:assert/strict';
import { ResearchBriefGenerator } from '../research_brief_generator.js';

test('generates video-ready citation-grounded research brief', () => {
  const generator = new ResearchBriefGenerator();
  const brief = generator.generate({
    briefId: 'BRIEF-001',
    topic: 'AI copilots for software teams',
    sourceManifestHash: 'sha256:abc123',
    mappedClaims: [
      {
        claim_id: 'CLAIM-001',
        claim: 'AI copilots can reduce boilerplate coding time.',
        source_ids: ['SRC-001'],
        evidence: [{ source_id: 'SRC-001', url: 'https://example.org/copilot-study', excerpts: ['Reduced repetitive coding in benchmark tasks.'] }],
        confidence: 0.92,
        verified: true,
      },
      {
        claim_id: 'CLAIM-002',
        claim: 'AI copilots never introduce incorrect suggestions.',
        source_ids: [],
        evidence: [],
        confidence: 0,
        verified: false,
      },
    ],
    contradictions: [{ claim_a: 'CLAIM-001', claim_b: 'CLAIM-002', reason: 'opposite findings' }],
  });

  const data = brief.toJSON();
  assert.equal(data.brief_id, 'BRIEF-001');
  assert.equal(data.topic, 'AI copilots for software teams');
  assert.equal(data.source_manifest_hash, 'sha256:abc123');
  assert.ok(data.summary.includes('Verified claims:'));
  assert.ok(data.key_claims.length >= 2);
  assert.ok(data.evidence_table.length >= 2);
  assert.ok(data.video_angles.length >= 2);
  assert.ok(data.brief_hash.startsWith('sha256:'));
});
