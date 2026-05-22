export function suggestPacingFixes(script = { lines: [] }) {
  return (script.lines ?? []).flatMap((line, index) => {
    const suggestions = [];
    if ((line.duration_sec ?? 0) > 9) {
      suggestions.push({
        suggestion_id: `PACE-${String(index + 1).padStart(3, '0')}`,
        type: 'pacing',
        scene_id: line.scene_id,
        text: 'Consider splitting this narration line into two shorter beats.',
        score: 0.88,
      });
    }
    if ((line.text ?? '').length < 30) {
      suggestions.push({
        suggestion_id: `SCRIPT-${String(index + 1).padStart(3, '0')}`,
        type: 'script',
        scene_id: line.scene_id,
        text: 'Expand this line with one concrete example for clarity.',
        score: 0.74,
      });
    }
    return suggestions;
  });
}

export function suggestTitleIdeas(context = {}) {
  const title = context.title ?? 'Untitled Video';
  return [
    `${title}: The Practical Guide`,
    `${title} — What Actually Works`,
    `${title} in 5 Minutes`,
  ].map((text, index) => ({
    suggestion_id: `TITLE-${String(index + 1).padStart(3, '0')}`,
    type: 'title',
    text,
    score: 0.86 - index * 0.08,
  }));
}
