import { sha256Hash } from '../visual/visual_hash.js';

export function hashContractPayload(contractWithoutHash) {
  return sha256Hash(contractWithoutHash);
}

export function withContractHash(contract) {
  const { hash: _ignored, ...rest } = contract;
  return {
    ...rest,
    hash: hashContractPayload(rest),
  };
}

export function verifyContractHash(contract) {
  const { hash, ...rest } = contract;
  return hash === hashContractPayload(rest);
}
