import test from 'node:test';
import assert from 'node:assert/strict';
import { withContractHash, verifyContractHash } from '../contract_hasher.js';

test('contract hashing is deterministic and tamper detectable', () => {
  const payload = {
    request_id: 'REQ-001',
    source: 'creator-tool',
    context_manifest: {},
    research_output: {},
    storyboard: {},
    scene_graph: {},
    timeline: {},
    audio_manifest: {},
    asset_manifest: {},
    render_contract: {},
  };

  const a = withContractHash(payload);
  const b = withContractHash(payload);
  assert.equal(a.hash, b.hash);
  assert.equal(verifyContractHash(a), true);

  const tampered = { ...a, source: 'manual' };
  assert.equal(verifyContractHash(tampered), false);
});
