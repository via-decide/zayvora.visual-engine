import { ALLOWED_SOURCES, REQUIRED_CONTRACT_FIELDS } from './contract_schema.js';
import { verifyContractHash } from './contract_hasher.js';

export function validateContractStrict(contract) {
  const keys = Object.keys(contract);
  const missing = REQUIRED_CONTRACT_FIELDS.filter((field) => contract[field] === undefined);
  const extras = keys.filter((key) => !REQUIRED_CONTRACT_FIELDS.includes(key));
  const invalidSource = !ALLOWED_SOURCES.includes(contract.source);
  const objectFields = [
    'context_manifest',
    'research_output',
    'storyboard',
    'scene_graph',
    'timeline',
    'audio_manifest',
    'asset_manifest',
    'render_contract',
  ];
  const invalidObjects = objectFields.filter((field) => typeof contract[field] !== 'object' || contract[field] === null || Array.isArray(contract[field]));

  const validHash = missing.length === 0 ? verifyContractHash(contract) : false;

  return {
    valid: missing.length === 0 && extras.length === 0 && !invalidSource && invalidObjects.length === 0 && validHash,
    missing,
    extras,
    invalid_source: invalidSource,
    invalid_objects: invalidObjects,
    invalid_hash: !validHash,
  };
}
