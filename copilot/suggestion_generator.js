import { generateHookSuggestions } from './hook_generator.js';
import { suggestPacingFixes, suggestTitleIdeas } from './script_optimizer.js';
import { suggestVisualImprovements, suggestThumbnailIdeas } from './visual_optimizer.js';

export function generateCopilotSuggestions(input = {}) {
  const hooks = generateHookSuggestions(input.context ?? {});
  const pacing = suggestPacingFixes(input.script ?? { lines: [] });
  const titles = suggestTitleIdeas(input.context ?? {});
  const visuals = suggestVisualImprovements(input.scene_graph ?? { scenes: [] });
  const thumbs = suggestThumbnailIdeas(input.context ?? {});

  return [...hooks, ...pacing, ...titles, ...visuals, ...thumbs]
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export function suggestionsToEditCommands(suggestions = []) {
  return suggestions.map((s, index) => ({
    command_id: `COPILOT-CMD-${String(index + 1).padStart(5, '0')}`,
    type: 'copilot_suggestion',
    target_id: s.scene_id ?? s.type,
    payload: {
      suggestion_id: s.suggestion_id,
      suggestion_type: s.type,
      text: s.text,
      score: s.score,
      rank: s.rank,
    },
  }));
}
