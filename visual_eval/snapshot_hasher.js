import { sha256Hash } from '../visual/visual_hash.js';

export function hashFrameModel(frameModel) {
  return sha256Hash(frameModel);
}

export function hashSceneSnapshot(sceneSnapshot) {
  return sha256Hash(sceneSnapshot);
}

export function hashRenderContract(renderContract) {
  return sha256Hash(renderContract);
}

export function compareSnapshotHashes(previousHash, currentHash) {
  return {
    identical: previousHash === currentHash,
    previous: previousHash,
    current: currentHash,
  };
}
