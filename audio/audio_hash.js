import { sha256Hash } from '../visual/visual_hash.js';

export function hashAudioPayload(payload) {
  return sha256Hash(payload);
}

export function hashAudioScene(sceneAudio) {
  return sha256Hash(sceneAudio);
}
