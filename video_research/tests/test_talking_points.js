import test from 'node:test';
import assert from 'node:assert/strict';
import { TalkingPointsBuilder } from '../talking_points_builder.js';

test('builds talking points with contradictions section', () => {
  const builder = new TalkingPointsBuilder();
  const points = builder.build({
    key_claims: [
      { claim_id: 'CLAIM-001', claim: 'Claim one', confidence: 0.9, verified: true, source_ids: ['SRC-1'] },
      { claim_id: 'CLAIM-002', claim: 'Claim two', confidence: 0.2, verified: false, source_ids: [] },
    ],
    contradictions: [{ claim_a: 'CLAIM-001', claim_b: 'CLAIM-002' }],
  });

  assert.equal(points.length, 3);
  assert.equal(points[0].section, 'Section 1');
  assert.equal(points[2].section, 'Contradictions');
});
