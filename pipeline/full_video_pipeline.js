import { nexResearchToVideoContract } from '../integrations/nex_bridge.js';
import { compileNarrationScript } from '../narration/script_compiler.js';
import { renderNarrationAudioFromStoryboard } from '../audio/audio_renderer.js';
import { renderFinalVideo } from '../render/video_renderer.js';
import { generateCaptionsFromNarration } from '../captions/caption_generator.js';
import { packageYouTubeExport } from '../youtube/youtube_packager.js';
import { PipelineStateManager } from './state_manager.js';
import { validateStagePayload, buildFullTrace } from './orchestrator.js';

export function runFullNotebookLmReplacementPipeline(input) {
  const request_id = input.request_id ?? input.nex_output?.request_id ?? 'PIPELINE-REQ-001';
  const state = new PipelineStateManager(request_id);

  state.setStage('input', input);

  const nex = nexResearchToVideoContract(input.nex_output ?? {}, { target: 'json' });
  state.setStage('nex', nex);

  const storyboard = {
    request_id,
    scenes: (nex.beats ?? []).map((beat, index) => ({
      scene_id: `SCENE-${String(index + 1).padStart(3, '0')}`,
      title: beat.title,
      summary: beat.narrative,
      tone: 'professional',
    })),
  };
  state.setStage('storyboard', storyboard);

  const script = compileNarrationScript(storyboard, { source: 'nex' });
  state.setStage('script', script);

  const audio = renderNarrationAudioFromStoryboard(storyboard, { source: 'nex' });
  state.setStage('audio', audio);

  const scene_graph = nex.run.scene_graph;
  state.setStage('scene_graph', scene_graph);

  const timeline = nex.run.timeline;
  state.setStage('timeline', timeline);

  const render_contract = nex.run.render_contract;
  state.setStage('render_contract', render_contract);

  const captions = generateCaptionsFromNarration(script, { burned_captions: true, source: 'nex' });
  state.setStage('captions', captions);

  const video = renderFinalVideo({
    request_id,
    render_contract,
    scene_graph,
    timeline,
    audio_manifest: audio.audio_manifest,
    caption_vtt_path: 'outputs/captions.vtt',
    base_video_path: 'outputs/video.base.mp4',
  });
  video.scene_graph = scene_graph;
  video.timeline = timeline;
  state.setStage('video', video);

  const youtube_package = packageYouTubeExport({
    render_result: video,
    caption_payload: captions,
    context: {
      title: nex.normalized.title,
      summary: 'NotebookLM replacement deterministic export',
      highlights: (nex.beats ?? []).map((beat) => beat.title),
      citations: nex.citations,
    },
  });
  state.setStage('youtube_package', youtube_package);

  for (const stage of state.getState().stage_order) {
    const payload = state.getState().stages[stage].payload;
    const validation = validateStagePayload(stage, payload);
    state.setStageValidation(stage, validation.valid, validation.reason);
  }

  const finalState = state.getState();
  const trace = buildFullTrace(finalState);

  return {
    request_id,
    stages: finalState,
    trace,
    deterministic: true,
  };
}
