import test from 'node:test';
import assert from 'node:assert/strict';
import { ContradictionDetector } from '../contradiction_detector.js';

test('detects contradictory claims with similar semantics and opposite polarity', () => {
  const detector = new ContradictionDetector();
  const contradictions = detector.detect([
    { claim_id: 'CLAIM-001', claim: 'Remote work increases software engineering productivity across teams.' },
    { claim_id: 'CLAIM-002', claim: 'Remote work does not increase software engineering productivity across teams.' },
    { claim_id: 'CLAIM-003', claim: 'Databases benefit from indexing for faster reads.' },
  ]);

  assert.equal(contradictions.length, 1);
  assert.equal(contradictions[0].claim_a, 'CLAIM-001');
  assert.equal(contradictions[0].claim_b, 'CLAIM-002');
});
