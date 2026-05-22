import test from 'node:test';
import assert from 'node:assert/strict';
import { CitationTableBuilder } from '../citation_table_builder.js';

test('builds citation rows and keeps unsupported claims visible', () => {
  const builder = new CitationTableBuilder();
  const rows = builder.build([
    {
      claim_id: 'CLAIM-001',
      confidence: 0.8,
      verified: true,
      evidence: [{ source_id: 'SRC-001', url: 'https://example.org/a', excerpts: ['a', 'b', 'c', 'd'] }],
    },
    {
      claim_id: 'CLAIM-002',
      confidence: 0.1,
      verified: false,
      evidence: [],
    },
  ]);

  assert.equal(rows.length, 2);
  assert.equal(rows[0].excerpts.length, 3);
  assert.equal(rows[1].verified, false);
  assert.equal(rows[1].source_id, null);
});
