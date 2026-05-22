import test from 'node:test';
import assert from 'node:assert/strict';
import { compileNarrationScript } from '../narration/script_compiler.js';
import { generateCaptionsFromNarration } from '../captions/caption_generator.js';
import { exportSrt } from '../captions/srt_exporter.js';
import { exportVtt } from '../captions/vtt_exporter.js';
import { validateCaptionTiming } from '../captions/caption_timeline.js';

test('captions are generated with synced timing and export to srt/vtt deterministically', () => {
  const storyboard = {
    request_id: 'CAP-REQ-001',
    scenes: [
      { scene_id: 'SCENE-001', summary: 'First caption line, with pause.', tone: 'friendly' },
      { scene_id: 'SCENE-002', summary: 'Second caption line for subtitle export.', tone: 'professional' },
    ],
  };

  const narration = compileNarrationScript(storyboard, { source: 'visual-engine' });
  const captionsA = generateCaptionsFromNarration(narration, { burned_captions: true });
  const captionsB = generateCaptionsFromNarration(narration, { burned_captions: true });

  const timing = validateCaptionTiming(captionsA.captions);
  assert.equal(timing.valid, true);
  assert.equal(captionsA.caption_hash, captionsB.caption_hash);
  assert.equal(captionsA.captions[0].start_sec, 0);
  assert.equal(captionsA.captions[1].start_sec, captionsA.captions[0].end_sec);

  const srt = exportSrt(captionsA);
  const vtt = exportVtt(captionsA);
  assert.equal(srt.includes('-->'), true);
  assert.equal(vtt.startsWith('WEBVTT'), true);
  assert.equal(captionsA.burned_captions, true);
});
