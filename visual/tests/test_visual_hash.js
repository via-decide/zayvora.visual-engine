import test from 'node:test';
import assert from 'node:assert/strict';
import { AssetManifest } from '../asset_manifest.js';
import { RenderContract } from '../render_contract.js';

test('asset manifest hash stable and render contract integrity', () => {
  const manifest = new AssetManifest();
  const first = manifest.registerAsset({ asset_id: 'ASSET-001', type: 'image', source: 'local', path: '/tmp/image.png', usage: ['SCENE-001'] });
  assert.equal(manifest.verifyAssetHash('ASSET-001'), true);
  const secondHash = manifest.listAssets()[0].hash;
  assert.equal(first.hash, secondHash);

  const rc = new RenderContract();
  const contract = rc.createRenderContract({
    contract_id: 'RENDER-001', renderer: 'html', width: 1920, height: 1080, fps: 30, duration_frames: 900,
    scene_graph_hash: 'sha256:a', timeline_hash: 'sha256:b', asset_manifest_hash: 'sha256:c',
  });
  assert.equal(rc.validateRenderContract(contract), true);
  assert.equal(rc.verifyRenderContractHash(contract), true);
});
