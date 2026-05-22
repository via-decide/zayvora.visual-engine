import { withContractHash } from './contract_hasher.js';
import { validateContractStrict } from './contract_validator.js';
import { registerContractVersion } from './contract_registry.js';

export function createEcosystemContract(payload) {
  const contract = withContractHash(payload);
  const validation = validateContractStrict(contract);
  if (!validation.valid) {
    throw new Error(`Invalid ecosystem contract: ${JSON.stringify(validation)}`);
  }
  registerContractVersion(contract);
  return contract;
}
