import test from 'node:test';
import assert from 'node:assert/strict';
import { VideoResearchPackager } from '../video_research_packager.js';

test('converts research brief into contract-ready video research package', () => {
  const packager = new VideoResearchPackager();
  const brief = {
    brief_hash: 'sha256:briefhash',
    topic: 'AI copilots in software delivery',
    source_manifest_hash: 'sha256:manifesthash',
    key_claims: [
      { claim_id: 'CLAIM-001', claim: 'Copilots accelerate repetitive coding tasks.', confidence: 0.95, verified: true, source_ids: ['SRC-001'] },
      { claim_id: 'CLAIM-002', claim: 'Copilot outputs always compile perfectly.', confidence: 0.1, verified: false, source_ids: [] },
    ],
    contradictions: [{ claim_a: 'CLAIM-001', claim_b: 'CLAIM-002', reason: 'conflicting reliability evidence' }],
    evidence_table: [
      { claim_id: 'CLAIM-001', source_id: 'SRC-001', url: 'https://example.org/study', excerpts: ['Measured reduction in coding time'], verified: true, confidence: 0.95 },
      { claim_id: 'CLAIM-002', source_id: null, url: '', excerpts: [], verified: false, confidence: 0.1 },
    ],
  };

  const pkg = packager.packageFromBrief(brief, { packageId: 'VRP-001' }).toJSON();

  assert.equal(pkg.package_id, 'VRP-001');
  assert.equal(pkg.contract_ready, true);
  assert.equal(pkg.topic, 'AI copilots in software delivery');
  assert.ok(pkg.video_title_options.length >= 3);
  assert.ok(pkg.hook_options.length >= 3);
  assert.ok(pkg.talking_points.length >= 2);
  assert.ok(pkg.source_cards.length >= 1);
  assert.equal(pkg.citations.length, 2);
  assert.equal(pkg.source_manifest_hash, 'sha256:manifesthash');
  assert.ok(pkg.package_hash.startsWith('sha256:'));
});
