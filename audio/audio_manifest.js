import { hashAudioPayload } from './audio_hash.js';

export function buildAudioManifest(audioRun) {
  const timeline = (audioRun.scenes ?? []).map((scene, index) => ({
    scene_id: scene.scene_id,
    start_sec: Number((audioRun.scenes.slice(0, index).reduce((sum, s) => sum + s.duration_sec, 0)).toFixed(2)),
    duration_sec: scene.duration_sec,
    end_sec: Number((audioRun.scenes.slice(0, index + 1).reduce((sum, s) => sum + s.duration_sec, 0)).toFixed(2)),
    audio_hash: scene.audio_hash,
  }));

  const manifest = {
    request_id: audioRun.request_id,
    scene_audio: audioRun.scenes,
    audio_timeline: timeline,
    total_duration_sec: audioRun.total_duration_sec,
    deterministic: true,
  };
  manifest.audio_manifest_hash = hashAudioPayload(manifest);
  return manifest;
}
