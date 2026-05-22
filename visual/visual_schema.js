const REQUIRED_TOP_LEVEL_FIELDS = [
  'schema_version',
  'request_id',
  'prompt',
  'normalized_intent',
  'format',
  'duration',
  'dimensions',
  'scenes',
  'timeline',
  'assets',
  'render_hash',
  'deterministic',
];

export const VISUAL_REQUEST_SCHEMA = {
  name: 'VISUAL_REQUEST_SCHEMA',
  required: REQUIRED_TOP_LEVEL_FIELDS,
};

export const SCENE_GRAPH_SCHEMA = {
  name: 'SCENE_GRAPH_SCHEMA',
  required: REQUIRED_TOP_LEVEL_FIELDS,
};

export const TIMELINE_SCHEMA = {
  name: 'TIMELINE_SCHEMA',
  required: REQUIRED_TOP_LEVEL_FIELDS,
};

export const ASSET_MANIFEST_SCHEMA = {
  name: 'ASSET_MANIFEST_SCHEMA',
  required: REQUIRED_TOP_LEVEL_FIELDS,
};

export const RENDER_CONTRACT_SCHEMA = {
  name: 'RENDER_CONTRACT_SCHEMA',
  required: REQUIRED_TOP_LEVEL_FIELDS,
};

export function validateRequiredFields(payload, schema = VISUAL_REQUEST_SCHEMA) {
  const missing = schema.required.filter((field) => payload[field] === undefined);
  return {
    valid: missing.length === 0,
    missing,
  };
}
