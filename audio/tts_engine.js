import { resolveVoice } from './voice_registry.js';
import { estimateDurationSec } from '../narration/pacing_engine.js';
import { hashAudioScene } from './audio_hash.js';

export function synthesizeSceneAudio(line, options = {}) {
  const voice = resolveVoice(line.tone);
  const duration_sec = options.duration_sec ?? estimateDurationSec(line.text, options.words_per_minute ?? 150);
  const audio = {
    scene_id: line.scene_id,
    text: line.text,
    tone: line.tone,
    pause_points: line.pause_points ?? [],
    voice,
    duration_sec: Number(duration_sec.toFixed(2)),
    audio_path: `outputs/audio/${line.scene_id}.wav`,
    deterministic: true,
  };
  audio.audio_hash = hashAudioScene(audio);
  return audio;
}

export function synthesizeNarrationScript(script, options = {}) {
  const scenes = (script.lines ?? []).map((line) => synthesizeSceneAudio(line, options));
  const total_duration_sec = Number(scenes.reduce((sum, scene) => sum + scene.duration_sec, 0).toFixed(2));
  return {
    request_id: script.request_id,
    scenes,
    total_duration_sec,
    deterministic: true,
  };
}
