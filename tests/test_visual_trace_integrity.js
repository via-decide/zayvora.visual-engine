import test from 'node:test';
import assert from 'node:assert/strict';
import { VisualGenerationEngine } from '../engine/visual_generation_engine.js';

test('visual trace includes all required hashes', () => {
  const engine = new VisualGenerationEngine({ renderer: 'json' });
  const result = engine.generateFromPrompt('trace prompt', { target: 'json' });
  assert.equal(engine.verifyGenerationTrace(result.trace), true);
});
