import test from 'node:test';
import assert from 'node:assert/strict';
import { runVideoCopilot } from '../copilot/copilot_engine.js';

test('copilot produces deterministic suggest-only edit commands for script/visual/title/thumbnail optimization', () => {
  const input = {
    request_id: 'COPILOT-REQ-900',
    context: {
      title: 'Why APIs Fail at Scale',
      prompt: 'Explain API failures and fixes',
    },
    script: {
      lines: [
        { scene_id: 'SCENE-001', text: 'A very long narration line that likely needs to be split for better pacing and comprehension in short-form video content.', duration_sec: 12.4 },
        { scene_id: 'SCENE-002', text: 'Short line.', duration_sec: 2.1 },
      ],
    },
    scene_graph: {
      scenes: [
        { scene_id: 'SCENE-001', title: 'Problem' },
        { scene_id: 'SCENE-002', title: 'Fix' },
      ],
    },
  };

  const a = runVideoCopilot(input);
  const b = runVideoCopilot(input);

  assert.equal(a.mode, 'suggest_only');
  assert.equal(a.suggestions.length > 0, true);
  assert.equal(a.edit_commands.length, a.suggestions.length);
  assert.equal(a.edit_commands[0].command_id, 'COPILOT-CMD-00001');
  assert.equal(a.copilot_hash, b.copilot_hash);

  const suggestionTypes = new Set(a.suggestions.map((s) => s.type));
  assert.equal(suggestionTypes.has('hook'), true);
  assert.equal(suggestionTypes.has('visual'), true);
  assert.equal(suggestionTypes.has('pacing') || suggestionTypes.has('script'), true);
  assert.equal(suggestionTypes.has('title'), true);
  assert.equal(suggestionTypes.has('thumbnail'), true);
});
