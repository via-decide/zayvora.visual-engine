export function generateHookSuggestions(context = {}) {
  const base = context.title ?? context.prompt ?? 'Your topic';
  const hooks = [
    `Why ${base} fails in production (and how to fix it).`,
    `The hidden reason ${base} breaks at scale.`,
    `${base}: 3 mistakes teams repeat every quarter.`,
  ];
  return hooks.map((text, index) => ({
    suggestion_id: `HOOK-${String(index + 1).padStart(3, '0')}`,
    type: 'hook',
    text,
    score: 0.9 - index * 0.1,
  }));
}
