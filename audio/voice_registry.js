const VOICE_REGISTRY = {
  neutral: { voice_id: 'voice-neutral-01', provider: 'deterministic-tts', speed: 1.0 },
  professional: { voice_id: 'voice-pro-01', provider: 'deterministic-tts', speed: 0.98 },
  energetic: { voice_id: 'voice-energy-01', provider: 'deterministic-tts', speed: 1.05 },
  friendly: { voice_id: 'voice-friendly-01', provider: 'deterministic-tts', speed: 1.0 },
};

export function resolveVoice(tone = 'neutral') {
  return VOICE_REGISTRY[tone] ?? VOICE_REGISTRY.neutral;
}

export function listVoices() {
  return { ...VOICE_REGISTRY };
}
