export function buildCaptionTimeline(narrationScript) {
  const lines = narrationScript.lines ?? [];
  let cursor = 0;
  return lines.map((line, index) => {
    const start_sec = Number(cursor.toFixed(2));
    const end_sec = Number((cursor + line.duration_sec).toFixed(2));
    cursor = end_sec;
    return {
      index: index + 1,
      scene_id: line.scene_id,
      text: line.text,
      tone: line.tone,
      start_sec,
      end_sec,
      duration_sec: line.duration_sec,
      burned: true,
    };
  });
}

export function validateCaptionTiming(timeline = []) {
  if (!timeline.length) return { valid: true, issues: [] };
  const issues = [];
  for (let i = 0; i < timeline.length; i += 1) {
    const item = timeline[i];
    if (item.end_sec < item.start_sec) {
      issues.push({ index: item.index, type: 'negative_duration' });
    }
    if (i > 0 && item.start_sec !== timeline[i - 1].end_sec) {
      issues.push({ index: item.index, type: 'gap_or_overlap' });
    }
  }
  return { valid: issues.length === 0, issues };
}
