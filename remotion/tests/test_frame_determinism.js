import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ZayvoraComposition } from '../Composition.js';

test('same frame renders identical model and templates are compatible', () => {
  const scene_graph = { scenes: [{ scene_id: 'SCENE-001', duration_frames: 120, layers: [{ layer_id: 'T', type: 'text', content: 'X', position: { x: 10, y: 10 }, style: {} }] }] };
  const timeline = { segments: [{ scene_id: 'SCENE-001', start_frame: 0, duration_frames: 120 }], transitions: [], keyframes: [] };
  const props = { frame: 10, scene_graph, timeline };
  assert.deepEqual(ZayvoraComposition(props), ZayvoraComposition(props));

  const templatesDir = path.join(process.cwd(), 'remotion', 'templates');
  const templates = fs.readdirSync(templatesDir).filter((item) => item.endsWith('.json'));
  assert.equal(templates.length >= 4, true);
  for (const template of templates) {
    const parsed = JSON.parse(fs.readFileSync(path.join(templatesDir, template), 'utf8'));
    assert.equal(Boolean(parsed.render_contract?.width), true);
    assert.equal(Array.isArray(parsed.scene_graph?.scenes), true);
    assert.equal(Array.isArray(parsed.timeline?.segments), true);
  }
});
