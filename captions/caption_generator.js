import { compileNarrationScript } from '../narration/script_compiler.js';
import { buildCaptionTimeline, validateCaptionTiming } from './caption_timeline.js';
import { sha256Hash } from '../visual/visual_hash.js';

export function generateCaptionsFromStoryboard(storyboard, options = {}) {
  const narration = compileNarrationScript(storyboard, options);
  return generateCaptionsFromNarration(narration, options);
}

export function generateCaptionsFromNarration(narrationScript, options = {}) {
  const timeline = buildCaptionTimeline(narrationScript);
  const timing = validateCaptionTiming(timeline);
  if (!timing.valid) {
    throw new Error(`Invalid caption timing: ${JSON.stringify(timing.issues)}`);
  }

  const payload = {
    request_id: narrationScript.request_id,
    source: options.source ?? narrationScript.source ?? 'visual-engine',
    captions: timeline,
    burned_captions: options.burned_captions ?? true,
    total_duration_sec: timeline.length ? timeline[timeline.length - 1].end_sec : 0,
    deterministic: true,
  };
  payload.caption_hash = sha256Hash(payload);
  return payload;
}
