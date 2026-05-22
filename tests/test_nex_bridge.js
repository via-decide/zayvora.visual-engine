import test from 'node:test';
import assert from 'node:assert/strict';
import { nexResearchToVideoContract } from '../integrations/nex_bridge.js';

test('nex bridge parses research, preserves citations, maps to contract, and hashes output', () => {
  const nexOutput = {
    request_id: 'NEX-REQ-900',
    title: 'Why APIs Fail at Scale',
    claims: [
      { claim_id: 'C1', text: 'Latency compounds across distributed systems.', section: 'Performance', citations: ['SRC-1'] },
      { claim_id: 'C2', text: 'Schema drift breaks contracts silently.', section: 'Reliability', citations: ['SRC-2'] },
    ],
    sources: [
      { citation_id: 'SRC-1', title: 'Latency Paper', url: 'https://example.com/latency' },
      { citation_id: 'SRC-2', title: 'Schema Drift Study', url: 'https://example.com/schema' },
    ],
    sections: [
      { section_id: 'S1', heading: 'Performance', beats: ['Latency compounds', 'Tail latency dominates'] },
      { section_id: 'S2', heading: 'Reliability', beats: ['Schema drift risks', 'Contract tests matter'] },
    ],
  };

  const result = nexResearchToVideoContract(nexOutput, { target: 'json' });

  assert.equal(result.parsed.request_id, 'NEX-REQ-900');
  assert.equal(result.beats.length, 2);
  assert.equal(result.citations.length, 2);
  assert.equal(result.ecosystem_contract.source, 'nex');
  assert.equal(Boolean(result.ecosystem_contract.hash), true);
  assert.equal(result.ecosystem_contract.research_output.sources[0].citation_id, 'SRC-1');
  assert.equal(result.ecosystem_contract.render_contract.render_hash, result.run.render_contract.render_hash);
});
