import test from 'node:test';
import assert from 'node:assert/strict';
import { EvidenceExtractor } from '../evidence_extractor.js';

test('marks unsupported claims as unverified and builds graph', () => {
  const extractor = new EvidenceExtractor({
    claimExtractor: {
      extractClaims() {
        return [
          { claim_id: 'CLAIM-001', claim: 'AI can automate repetitive analysis tasks in enterprises.' },
          { claim_id: 'CLAIM-002', claim: 'Quantum potatoes power interstellar accounting systems.' },
        ];
      },
    },
  });

  const result = extractor.extract([
    { source_id: 'SRC-001', url: 'https://example.org/one', text: 'AI can automate repetitive analysis tasks in enterprises.' },
    { source_id: 'SRC-002', url: 'https://example.org/two', text: 'This sentence is intentionally unrelated to the claim corpus.' },
  ]);

  assert.equal(result.claims.find((c) => c.claim_id === 'CLAIM-001').verified, true);
  assert.equal(result.claims.find((c) => c.claim_id === 'CLAIM-002').verified, false);
  assert.ok(result.graph.nodes.length >= result.claims.length);
});
