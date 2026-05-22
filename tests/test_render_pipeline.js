import test from 'node:test';
import assert from 'node:assert/strict';
import { renderFinalVideo } from '../render/video_renderer.js';
import { exportVtt } from '../captions/vtt_exporter.js';
import { generateCaptionsFromNarration } from '../captions/caption_generator.js';
import { compileNarrationScript } from '../narration/script_compiler.js';
import { promptToSceneGraph } from '../pipeline/prompt_to_scene.js';
import { sceneGraphToTimeline } from '../pipeline/scene_to_timeline.js';
import { timelineToRenderContract } from '../pipeline/timeline_to_contract.js';
import { renderNarrationAudioFromStoryboard } from '../audio/audio_renderer.js';

test('final render pipeline renders frames, muxes audio, burns captions, exports mp4, and verifies hash', () => {
  const storyboard = {
    request_id: 'RENDER-REQ-001',
    scenes: [
      { scene_id: 'SCENE-001', summary: 'First scene narration line.', tone: 'professional' },
      { scene_id: 'SCENE-002', summary: 'Second scene narration line.', tone: 'friendly' },
    ],
  };

  const scene_graph = promptToSceneGraph('Render pipeline prompt\nBeat A\nBeat B', { request_id: 'RENDER-REQ-001' });
  const timeline = sceneGraphToTimeline(scene_graph);
  const render_contract = timelineToRenderContract({
    request_id: scene_graph.request_id,
    prompt: scene_graph.prompt,
    normalized_intent: scene_graph.normalized_intent,
    scene_graph,
    timeline,
    renderer: 'remotion',
  });

  const audio = renderNarrationAudioFromStoryboard(storyboard);
  const narrationScript = compileNarrationScript(storyboard);
  const captions = generateCaptionsFromNarration(narrationScript, { burned_captions: true });
  const vtt = exportVtt(captions);
  assert.equal(vtt.startsWith('WEBVTT'), true);

  const run = renderFinalVideo({
    request_id: scene_graph.request_id,
    render_contract,
    scene_graph,
    timeline,
    audio_manifest: audio.audio_manifest,
    caption_vtt_path: 'outputs/captions.vtt',
    base_video_path: 'outputs/video.base.mp4',
  });

  assert.equal(run.frame_run.frame_count, render_contract.duration_frames);
  assert.equal(run.mux.final_video_path.endsWith('.mp4'), true);
  assert.equal(run.hash_verified, true);
  assert.equal(Boolean(run.manifest.render_manifest_hash), true);
});
