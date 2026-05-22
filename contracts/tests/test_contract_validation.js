import test from 'node:test';
import assert from 'node:assert/strict';
import { withContractHash } from '../contract_hasher.js';
import { validateContractStrict } from '../contract_validator.js';

function base() {
  return {
    request_id: 'REQ-001',
    source: 'nex',
    context_manifest: {},
    research_output: {},
    storyboard: {},
    scene_graph: {},
    timeline: {},
    audio_manifest: {},
    asset_manifest: {},
    render_contract: {},
  };
}

test('valid contract passes strict validation and incomplete contract is rejected', () => {
  const valid = withContractHash(base());
  const result = validateContractStrict(valid);
  assert.equal(result.valid, true);

  const invalid = { ...valid };
  delete invalid.timeline;
  const bad = validateContractStrict(invalid);
  assert.equal(bad.valid, false);
  assert.equal(bad.missing.includes('timeline'), true);
});
