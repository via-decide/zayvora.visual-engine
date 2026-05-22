import test from 'node:test';
import assert from 'node:assert/strict';
import { compileNarrationScript } from '../narration/script_compiler.js';

test('script compiler converts storyboard to deterministic narration with pauses and duration', () => {
  const storyboard = {
    request_id: 'VISUAL-123',
    scenes: [
      {
        scene_id: 'SCENE-001',
        title: 'Why APIs fail at scale',
        summary: 'Latency, retries, and cascading failures can compound quickly.',
        tone: 'serious',
      },
      {
        scene_id: 'SCENE-002',
        summary: 'Contract testing and observability reduce breakage and speed recovery.',
      },
    ],
  };

  const a = compileNarrationScript(storyboard, { source: 'creator-tool' });
  const b = compileNarrationScript(storyboard, { source: 'creator-tool' });

  assert.equal(a.lines.length, 2);
  assert.equal(a.lines[0].scene_id, 'SCENE-001');
  assert.equal(typeof a.lines[0].duration_sec, 'number');
  assert.equal(Array.isArray(a.lines[0].pause_points), true);
  assert.equal(a.lines[0].tone, 'professional');
  assert.equal(a.narration_hash, b.narration_hash);
  assert.equal(a.total_duration_sec > 0, true);
});
