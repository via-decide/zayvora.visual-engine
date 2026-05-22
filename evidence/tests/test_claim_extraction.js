import test from 'node:test';
import assert from 'node:assert/strict';
import { ClaimExtractor } from '../claim_extractor.js';

test('extracts claim-like sentences from sources', () => {
  const extractor = new ClaimExtractor();
  const claims = extractor.extractClaims([
    { source_id: 'SRC-001', text: 'The vaccine is effective in preventing severe disease. Short note. It has a strong safety profile in adults.' },
  ]);

  assert.equal(claims.length, 2);
  assert.equal(claims[0].claim_id, 'CLAIM-001');
});
