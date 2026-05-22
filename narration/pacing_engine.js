export function estimateDurationSec(text, wordsPerMinute = 150) {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  const duration = (words / wordsPerMinute) * 60;
  return Number(duration.toFixed(2));
}

export function addPausePoints(text) {
  const pause_points = [];
  const source = String(text ?? '');
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] === ',' || source[i] === '.' || source[i] === ';' || source[i] === ':') {
      pause_points.push(i);
    }
  }
  return pause_points;
}
