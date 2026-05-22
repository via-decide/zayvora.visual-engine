import test from 'node:test';
import assert from 'node:assert/strict';
import { ECOSYSTEM_CONTRACT_SCHEMA, REQUIRED_CONTRACT_FIELDS, ALLOWED_SOURCES } from '../contract_schema.js';

test('contract schema defines required fields and allowed sources', () => {
  assert.equal(ECOSYSTEM_CONTRACT_SCHEMA.schema_version, '1.0.0');
  assert.equal(REQUIRED_CONTRACT_FIELDS.length, 11);
  assert.deepEqual(ALLOWED_SOURCES, ['nex', 'creator-tool', 'manual']);
});
