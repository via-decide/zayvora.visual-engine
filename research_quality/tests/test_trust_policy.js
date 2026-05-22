import test from 'node:test';
import assert from 'node:assert/strict';
import { TrustPolicy } from '../trust_policy.js';

test('marks official/docs/papers as preferred primary sources', () => {
  const policy = new TrustPolicy();

  const primary = policy.evaluate({ sourceType: 'papers' });
  const secondary = policy.evaluate({ sourceType: 'articles' });

  assert.equal(primary.isPrimary, true);
  assert.equal(primary.policyLabel, 'prefer');
  assert.equal(secondary.isPrimary, false);
  assert.equal(secondary.isCommentary, true);
  assert.ok(primary.citationUsefulness > secondary.citationUsefulness);
});
