import test from 'node:test';
import assert from 'node:assert/strict';
import { EcosystemContractExporter } from '../ecosystem_contract_exporter.js';

test('exports ecosystem contract with verification and hash', () => {
  const exporter = new EcosystemContractExporter();
  const contract = exporter.export({
    storyboardPayload: { topic: 'Topic', storyboard_sections: [] },
    verificationReport: { ready_for_video: true, verified: true, citation_coverage: 1, unsupported_claims: [], weak_sources: [] },
    packageData: { package_id: 'VRP-001', package_hash: 'sha256:pkg', source_manifest_hash: 'sha256:src' },
  });

  assert.equal(contract.contract_type, 'nex.visual_engine.handoff.v1');
  assert.equal(contract.ready_for_visual_engine, true);
  assert.ok(contract.contract_hash.startsWith('sha256:'));
});
