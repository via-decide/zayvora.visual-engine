import { sha256Hash } from './visual_hash.js';

export class RenderContract {
  createRenderContract(contract) {
    const base = { ...contract };
    base.contract_hash = sha256Hash(base);
    return base;
  }

  validateRenderContract(contract) {
    const required = [
      'contract_id',
      'renderer',
      'width',
      'height',
      'fps',
      'duration_frames',
      'scene_graph_hash',
      'timeline_hash',
      'asset_manifest_hash',
    ];
    return required.every((field) => contract[field] !== undefined);
  }

  freezeRenderContract(contract) {
    return Object.freeze({ ...contract });
  }

  verifyRenderContractHash(contract) {
    const { contract_hash: givenHash, ...rest } = contract;
    return givenHash === sha256Hash(rest);
  }
}
