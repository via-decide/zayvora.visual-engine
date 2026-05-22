import test from 'node:test';
import assert from 'node:assert/strict';
import { renderNarrationAudioFromStoryboard } from '../audio/audio_renderer.js';

test('tts engine deterministically generates per-scene audio, durations, hashes, and timeline', () => {
  const storyboard = {
    request_id: 'AUDIO-REQ-001',
    scenes: [
      {
        scene_id: 'SCENE-001',
        summary: 'Latency and retries can create cascading failures, so monitoring matters.',
        tone: 'professional',
      },
      {
        scene_id: 'SCENE-002',
        summary: 'Contract tests and rollback plans improve resilience.',
        tone: 'friendly',
      },
    ],
  };

  const first = renderNarrationAudioFromStoryboard(storyboard, { source: 'visual-engine' });
  const second = renderNarrationAudioFromStoryboard(storyboard, { source: 'visual-engine' });

  assert.equal(first.audio_run.scenes.length, 2);
  assert.equal(first.audio_run.total_duration_sec > 0, true);
  assert.equal(first.audio_manifest.audio_timeline.length, 2);
  assert.equal(first.audio_run.scenes[0].audio_hash, second.audio_run.scenes[0].audio_hash);
  assert.equal(first.audio_manifest.audio_manifest_hash, second.audio_manifest.audio_manifest_hash);
  assert.equal(first.audio_manifest.audio_timeline[0].start_sec, 0);
  assert.equal(first.audio_manifest.audio_timeline[1].start_sec, first.audio_manifest.audio_timeline[0].end_sec);
});
