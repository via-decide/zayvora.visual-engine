function formatSrtTime(seconds) {
  const msTotal = Math.round(seconds * 1000);
  const ms = msTotal % 1000;
  const totalSeconds = Math.floor(msTotal / 1000);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

export function exportSrt(captionPayload) {
  return (captionPayload.captions ?? []).map((caption) => (
`${caption.index}
${formatSrtTime(caption.start_sec)} --> ${formatSrtTime(caption.end_sec)}
${caption.text}
`
  )).join('\n');
}
