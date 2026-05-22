export function normalizeTone(inputTone = 'neutral') {
  const tone = String(inputTone).toLowerCase();
  if (tone.includes('urgent') || tone.includes('high-energy')) return 'energetic';
  if (tone.includes('serious') || tone.includes('professional')) return 'professional';
  if (tone.includes('warm') || tone.includes('friendly')) return 'friendly';
  return 'neutral';
}

export function inferToneFromScene(scene = {}) {
  const text = `${scene.title ?? ''} ${scene.summary ?? ''}`.toLowerCase();
  if (text.includes('warning') || text.includes('risk')) return 'professional';
  if (text.includes('launch') || text.includes('win')) return 'energetic';
  return 'neutral';
}
