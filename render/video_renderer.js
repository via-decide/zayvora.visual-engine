import { renderFramesFromContract } from './remotion_adapter.js';
import { muxAudioVideoAndCaptions } from './audio_video_muxer.js';
import { createRenderManifest, verifyRenderHash } from './render_manifest.js';

export function renderFinalVideo({ request_id, render_contract, scene_graph, timeline, audio_manifest, caption_vtt_path = 'outputs/captions.vtt', base_video_path = 'outputs/video.base.mp4' }) {
  const frameRun = renderFramesFromContract({ render_contract, scene_graph, timeline });
  const mux = muxAudioVideoAndCaptions({
    base_video_path,
    audio_manifest,
    caption_vtt_path,
  });
  const manifest = createRenderManifest({
    request_id,
    render_contract,
    frames_hash: frameRun.frames_hash,
    mux_result: mux,
  });
  return {
    frame_run: frameRun,
    mux,
    manifest,
    hash_verified: verifyRenderHash(manifest),
    deterministic: true,
  };
}
