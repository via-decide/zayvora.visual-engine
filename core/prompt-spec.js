'use strict';

function normalizePromptSpec(promptSpec) {
  if (!promptSpec || typeof promptSpec !== 'object') {
    throw new Error('promptSpec must be an object');
  }

  const basePrompt = String(promptSpec.base_prompt || '').trim();
  if (!basePrompt) throw new Error('base_prompt is required');

  const preferences = promptSpec.preferences || {};
  const constraints = promptSpec.constraints || {};

  return {
    base_prompt: basePrompt,
    preferences: {
      style: normalizeStringArray(preferences.style),
      lighting: normalizeStringArray(preferences.lighting),
      composition: normalizeStringArray(preferences.composition)
    },
    constraints: {
      max_images: normalizePositiveInt(constraints.max_images, 12),
      resolution: normalizePositiveInt(constraints.resolution, 1024),
      latency_bound_ms: normalizePositiveInt(constraints.latency_bound_ms, 3000)
    }
  };
}

function normalizeStringArray(value) {
  if (!Array.isArray(value) || value.length === 0) return ['default'];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function normalizePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

module.exports = {
  normalizePromptSpec
};
