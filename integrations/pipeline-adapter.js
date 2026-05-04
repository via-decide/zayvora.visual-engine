import { run } from '../core/execution/orchestrator.js';
import * as localEngine from '../core/execution/engines/local-engine.js';

function validate(plan) {
  if (!plan || typeof plan !== 'object') throw new Error('INVALID_PLAN');
  if (!plan.actionId) throw new Error('MISSING_ACTION_ID');
  if (!plan.input) throw new Error('MISSING_INPUT');
}

export async function runPipeline(plan) {
  validate(plan);
  try {
    return await run({ engine: localEngine, input: plan.input, config: plan.config || {} });
  } catch (error) {
    throw { type: 'execution_failure', stage: 'generation', error };
  }
}
