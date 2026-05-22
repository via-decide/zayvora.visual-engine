import test from 'node:test';
import assert from 'node:assert/strict';
import { CitationMapper } from '../citation_mapper.js';

test('maps claims to source IDs and preserves short excerpts', () => {
  const mapper = new CitationMapper();
  const mapped = mapper.mapClaimsToEvidence(
    [{ claim_id: 'CLAIM-001', claim: 'Kubernetes improves deployment reliability.' }],
    [{ source_id: 'SRC-001', url: 'https://example.org/docs', text: 'Kubernetes improves deployment reliability across clusters.' }],
  );

  assert.equal(mapped[0].source_ids[0], 'SRC-001');
  assert.ok(mapped[0].evidence[0].excerpts[0].length > 0);
  assert.equal(mapped[0].verified, true);
});
