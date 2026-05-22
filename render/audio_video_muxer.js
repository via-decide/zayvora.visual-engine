import { mergeAudioTrack, burnCaptions, exportMp4 } from './ffmpeg_pipeline.js';

export function muxAudioVideoAndCaptions({ base_video_path, audio_manifest, caption_vtt_path }) {
  const merged = mergeAudioTrack(base_video_path, audio_manifest);
  const captioned = burnCaptions(merged.output_video_with_audio, caption_vtt_path);
  const exported = exportMp4(captioned.output_video_with_captions);
  return {
    merged,
    captioned,
    exported,
    final_video_path: exported.output_path,
    deterministic: true,
  };
}
