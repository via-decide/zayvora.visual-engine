import test from 'node:test';
import assert from 'node:assert/strict';
import { runFullNotebookLmReplacementPipeline } from '../pipeline/full_video_pipeline.js';

test('full notebooklm replacement pipeline connects stages, validates, tracks state, deterministic trace', () => {
  const input = {
    request_id: 'NB-REQ-001',
    nex_output: {
      request_id: 'NB-REQ-001',
      title: 'Why APIs Fail at Scale',
      claims: [
        { claim_id: 'C1', text: 'Latency grows non-linearly.', section: 'Performance', citations: ['SRC-1'] },
        { claim_id: 'C2', text: 'Schema drift causes production errors.', section: 'Reliability', citations: ['SRC-2'] },
      ],
      sources: [
        { citation_id: 'SRC-1', title: 'Latency Study', url: 'https://example.com/latency' },
        { citation_id: 'SRC-2', title: 'Schema Study', url: 'https://example.com/schema' },
      ],
      sections: [
        { section_id: 'S1', heading: 'Performance', beats: ['Latency trends', 'Queueing effects'] },
        { section_id: 'S2', heading: 'Reliability', beats: ['Schema drift', 'Contract checks'] },
      ],
    },
  };

  const a = runFullNotebookLmReplacementPipeline(input);
  const b = runFullNotebookLmReplacementPipeline(input);

  assert.equal(a.request_id, 'NB-REQ-001');
  assert.equal(a.stages.stage_order.length >= 10, true);
  assert.equal(a.stages.stages.render_contract.valid, true);
  assert.equal(a.stages.stages.youtube_package.valid, true);
  assert.equal(Boolean(a.trace.trace_hash), true);
  assert.equal(a.trace.trace_hash, b.trace.trace_hash);
  assert.equal(a.stages.state_hash, b.stages.state_hash);
});
