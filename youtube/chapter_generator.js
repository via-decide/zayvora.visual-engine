export function generateChaptersFromTimeline(timeline = {}, scenes = []) {
  const segments = timeline.segments ?? [];
  return segments.map((segment, index) => {
    const title = scenes[index]?.title ?? scenes[index]?.scene_id ?? segment.scene_id;
    const startSec = Math.floor(segment.start_frame / (timeline.fps ?? 30));
    const mm = String(Math.floor(startSec / 60)).padStart(2, '0');
    const ss = String(startSec % 60).padStart(2, '0');
    return {
      chapter_id: `CHAPTER-${String(index + 1).padStart(3, '0')}`,
      scene_id: segment.scene_id,
      title,
      start_sec: startSec,
      timestamp: `${mm}:${ss}`,
    };
  });
}

export function chaptersToDescription(chapters = []) {
  return chapters.map((chapter) => `${chapter.timestamp} ${chapter.title}`).join('\n');
}
