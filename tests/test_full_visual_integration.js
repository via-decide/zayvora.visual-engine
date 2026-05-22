import test from 'node:test';
import assert from 'node:assert/strict';
import { VisualGenerationEngine } from '../engine/visual_generation_engine.js';

test('full pipeline returns deterministic contract hash', () => {
  const engine = new VisualGenerationEngine({ renderer: 'json', request_id: 'VISUAL-001' });
  const a = engine.generateFromPrompt('explain why APIs fail at scale', { target: 'json' });
  const b = engine.generateFromPrompt('explain why APIs fail at scale', { target: 'json' });
  assert.equal(a.render_contract.render_hash, b.render_contract.render_hash);
  assert.equal(Boolean(a.output_manifest.render_contract_hash), true);
});
