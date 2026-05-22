export const NARRATION_SCHEMA_VERSION = '1.0.0';

export const NARRATION_SCRIPT_FIELDS = [
  'scene_id',
  'text',
  'duration_sec',
  'tone',
  'pause_points',
];

export function validateNarrationLine(line) {
  const missing = NARRATION_SCRIPT_FIELDS.filter((field) => line[field] === undefined);
  const valid = missing.length === 0
    && typeof line.scene_id === 'string'
    && typeof line.text === 'string'
    && typeof line.duration_sec === 'number'
    && typeof line.tone === 'string'
    && Array.isArray(line.pause_points);
  return { valid, missing };
}
