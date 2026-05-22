import { sha256Hash } from '../visual/visual_hash.js';
import { storyboardToNarrationPlan } from './narration_planner.js';
import { validateNarrationLine, NARRATION_SCHEMA_VERSION } from './narration_schema.js';

export function compileNarrationScript(storyboard = {}, options = {}) {
  const plan = storyboardToNarrationPlan(storyboard);
  const lines = plan.map((line) => ({ ...line, tone: line.tone }));
  const validations = lines.map((line) => validateNarrationLine(line));
  const valid = validations.every((item) => item.valid);
  if (!valid) {
    throw new Error(`Invalid narration script lines: ${JSON.stringify(validations)}`);
  }

  const payload = {
    schema_version: NARRATION_SCHEMA_VERSION,
    request_id: options.request_id ?? storyboard.request_id ?? 'NARRATION-REQ-001',
    source: options.source ?? 'visual-engine',
    lines,
    total_duration_sec: Number(lines.reduce((sum, line) => sum + line.duration_sec, 0).toFixed(2)),
    deterministic: true,
  };

  payload.narration_hash = sha256Hash(payload);
  return payload;
}
