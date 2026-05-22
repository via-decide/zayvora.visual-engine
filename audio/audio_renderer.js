import { compileNarrationScript } from '../narration/script_compiler.js';
import { synthesizeNarrationScript } from './tts_engine.js';
import { buildAudioManifest } from './audio_manifest.js';

export function renderNarrationAudioFromStoryboard(storyboard, options = {}) {
  const script = compileNarrationScript(storyboard, options);
  const audioRun = synthesizeNarrationScript(script, options);
  const manifest = buildAudioManifest(audioRun);
  return {
    script,
    audio_run: audioRun,
    audio_manifest: manifest,
    deterministic: true,
  };
}
