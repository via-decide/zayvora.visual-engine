import { ECOSYSTEM_CONTRACT_VERSION } from './contract_schema.js';

const REGISTRY = new Map();

export function registerContractVersion(contract) {
  if (!REGISTRY.has(ECOSYSTEM_CONTRACT_VERSION)) {
    REGISTRY.set(ECOSYSTEM_CONTRACT_VERSION, []);
  }
  REGISTRY.get(ECOSYSTEM_CONTRACT_VERSION).push(contract.request_id);
  return {
    schema_version: ECOSYSTEM_CONTRACT_VERSION,
    request_id: contract.request_id,
    count: REGISTRY.get(ECOSYSTEM_CONTRACT_VERSION).length,
  };
}

export function getRegisteredContracts(version = ECOSYSTEM_CONTRACT_VERSION) {
  return REGISTRY.get(version) ?? [];
}
