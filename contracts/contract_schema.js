export const ECOSYSTEM_CONTRACT_VERSION = '1.0.0';

export const REQUIRED_CONTRACT_FIELDS = [
  'request_id',
  'source',
  'context_manifest',
  'research_output',
  'storyboard',
  'scene_graph',
  'timeline',
  'audio_manifest',
  'asset_manifest',
  'render_contract',
  'hash',
];

export const ALLOWED_SOURCES = ['nex', 'creator-tool', 'manual'];

export const ECOSYSTEM_CONTRACT_SCHEMA = {
  schema_version: ECOSYSTEM_CONTRACT_VERSION,
  required_fields: REQUIRED_CONTRACT_FIELDS,
  allowed_sources: ALLOWED_SOURCES,
  additional_properties: false,
};
