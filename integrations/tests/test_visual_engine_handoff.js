import test from 'node:test';
import assert from 'node:assert/strict';
import { VisualEngineHandoff } from '../visual_engine_handoff.js';

test('builds verified handoff package for visual engine', () => {
  const handoff = new VisualEngineHandoff();

  const packageData = {
    package_id: 'VRP-001',
    package_hash: 'sha256:pkg',
    source_manifest_hash: 'sha256:src',
    topic: 'AI copilots',
    video_title_options: ['Title A'],
    hook_options: ['Hook A'],
    talking_points: [
      { section: 'Section 1', claim_id: 'CLAIM-001', talking_point: 'Point', confidence: 0.8, verified: true, source_ids: ['SRC-1'] },
    ],
    section_evidence: [
      { claim_id: 'CLAIM-001', evidence: { source_id: 'SRC-1', excerpts: ['proof'] } },
    ],
    citations: [{ claim_id: 'CLAIM-001', source_id: 'SRC-1', excerpts: ['proof'] }],
    source_cards: [{ source_id: 'SRC-1', url: 'https://example.org', claims: ['CLAIM-001'] }],
  };

  const verificationReport = {
    verified: true,
    unsupported_claims: [],
    weak_sources: [],
    citation_coverage: 1,
    ready_for_video: true,
  };

  const result = handoff.build({ packageData, verificationReport });
  assert.equal(result.validation.compatible, true);
  assert.equal(result.storyboard_payload.citations.length, 1);
  assert.equal(result.storyboard_payload.source_cards.length, 1);
  assert.equal(result.ecosystem_contract.ready_for_visual_engine, true);
});
