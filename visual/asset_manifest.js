import { sha256Hash } from './visual_hash.js';

export class AssetManifest {
  constructor() {
    this.assets = [];
  }

  registerAsset(asset) {
    const record = { ...asset, hash: asset.hash ?? sha256Hash(asset.path ?? asset.asset_id) };
    this.assets.push(record);
    return record;
  }

  registerGeneratedAsset(asset) {
    return this.registerAsset({ ...asset, source: 'generated' });
  }

  registerExternalAsset(asset) {
    return this.registerAsset({ ...asset, source: 'external' });
  }

  verifyAssetHash(assetId) {
    const asset = this.assets.find((item) => item.asset_id === assetId);
    if (!asset) return false;
    return asset.hash === sha256Hash(asset.path ?? asset.asset_id);
  }

  listAssets() {
    return [...this.assets];
  }

  exportManifest() {
    return { assets: this.listAssets(), manifest_hash: sha256Hash(this.assets) };
  }
}
