import test from 'node:test';
import assert from 'node:assert/strict';
import { UnsupportedClaimDetector } from '../unsupported_claim_detector.js';

test('detects unsupported or unverified talking points', () => {
  const detector = new UnsupportedClaimDetector();
  const unsupported = detector.detect(
    [
      { claim_id: 'CLAIM-001', talking_point: 'Supported point', verified: true },
      { claim_id: 'CLAIM-002', talking_point: 'Unsupported point', verified: false },
      { claim_id: 'CLAIM-003', talking_point: 'Missing evidence point', verified: true },
    ],
    [
      { claim_id: 'CLAIM-001', evidence: { excerpts: ['good evidence'] } },
      { claim_id: 'CLAIM-002', evidence: { excerpts: [] } },
    ],
  );

  assert.equal(unsupported.length, 2);
  assert.equal(unsupported[0].claim_id, 'CLAIM-002');
  assert.equal(unsupported[1].claim_id, 'CLAIM-003');
});
