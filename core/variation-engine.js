'use strict';

const { normalizePromptSpec } = require('./prompt-spec');

function generateVariations(promptSpec, options = {}) {
  const spec = normalizePromptSpec(promptSpec);
  const cap = Math.max(1, Math.floor(options.maxCombinations || spec.constraints.max_images || 12));

  const dimensions = ['style', 'lighting', 'composition'];
  const valuesByDimension = dimensions.map((key) => sortDeterministically(spec.preferences[key]));

  const out = [];
  for (const style of valuesByDimension[0]) {
    for (const lighting of valuesByDimension[1]) {
      for (const composition of valuesByDimension[2]) {
        const config = { style, lighting, composition };
        out.push({
          id: buildVariationId(spec.base_prompt, config),
          base_prompt: spec.base_prompt,
          config,
          constraints: { ...spec.constraints }
        });
        if (out.length >= cap) return out;
      }
    }
  }

  return out;
}

function sortDeterministically(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function buildVariationId(basePrompt, config) {
  const raw = `${basePrompt}|${config.style}|${config.lighting}|${config.composition}`;
  return `var_${stableHash(raw)}`;
}

function stableHash(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

module.exports = {
  generateVariations,
  stableHash
};
