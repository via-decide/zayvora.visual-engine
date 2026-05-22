import test from 'node:test';
import assert from 'node:assert/strict';
import { renderFinalVideo } from '../render/video_renderer.js';
import { promptToSceneGraph } from '../pipeline/prompt_to_scene.js';
import { sceneGraphToTimeline } from '../pipeline/scene_to_timeline.js';
import { timelineToRenderContract } from '../pipeline/timeline_to_contract.js';
import { compileNarrationScript } from '../narration/script_compiler.js';
import { generateCaptionsFromNarration } from '../captions/caption_generator.js';
import { renderNarrationAudioFromStoryboard } from '../audio/audio_renderer.js';
import { packageYouTubeExport } from '../youtube/youtube_packager.js';

test('youtube export package generates title/description/chapters/thumbnail and output package', () => {
  const storyboard = {
    request_id: 'YT-REQ-001',
    scenes: [
      { scene_id: 'SCENE-001', title: 'Intro', summary: 'Explain API scale risks.', tone: 'professional' },
      { scene_id: 'SCENE-002', title: 'Fixes', summary: 'Show remediation steps.', tone: 'friendly' },
    ],
  };

  const scene_graph = promptToSceneGraph('YouTube export prompt\nIntro\nFixes', { request_id: 'YT-REQ-001' });
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
  const narration = compileNarrationScript(storyboard);
  const captions = generateCaptionsFromNarration(narration, { burned_captions: true });

  const render_result = renderFinalVideo({
    request_id: scene_graph.request_id,
    render_contract,
    scene_graph,
    timeline,
    audio_manifest: audio.audio_manifest,
  });
  render_result.scene_graph = scene_graph;
  render_result.timeline = timeline;

  const pkgA = packageYouTubeExport({
    render_result,
    caption_payload: captions,
    context: {
      title: 'Why APIs Fail at Scale',
      summary: 'A deterministic breakdown of scaling failures.',
      highlights: ['Latency', 'Schema drift', 'Recovery patterns'],
      tags: ['api', 'scaling', 'engineering'],
    },
  });
  const pkgB = packageYouTubeExport({
    render_result,
    caption_payload: captions,
    context: {
      title: 'Why APIs Fail at Scale',
      summary: 'A deterministic breakdown of scaling failures.',
      highlights: ['Latency', 'Schema drift', 'Recovery patterns'],
      tags: ['api', 'scaling', 'engineering'],
    },
  });

  assert.equal(pkgA.video_mp4.endsWith('.mp4'), true);
  assert.equal(pkgA.captions_srt.endsWith('.srt'), true);
  assert.equal(pkgA.thumbnail_png.endsWith('.png'), true);
  assert.equal(pkgA.metadata_json.endsWith('.json'), true);
  assert.equal(pkgA.description_txt.endsWith('.txt'), true);
  assert.equal(pkgA.metadata.title.length > 0, true);
  assert.equal(Array.isArray(pkgA.chapters), true);
  assert.equal(pkgA.package_hash, pkgB.package_hash);
});
