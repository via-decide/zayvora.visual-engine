import { sha256Hash } from '../visual/visual_hash.js';
import { generateCopilotSuggestions, suggestionsToEditCommands } from './suggestion_generator.js';

export function runVideoCopilot(input = {}) {
  const suggestions = generateCopilotSuggestions(input);
  const edit_commands = suggestionsToEditCommands(suggestions);
  const output = {
    request_id: input.request_id ?? 'COPILOT-REQ-001',
    mode: 'suggest_only',
    suggestions,
    edit_commands,
    deterministic: true,
  };
  output.copilot_hash = sha256Hash(output);
  return output;
}
