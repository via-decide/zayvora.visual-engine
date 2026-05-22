import { sha256Hash } from '../visual/visual_hash.js';

export function mergeAudioTrack(videoPath, audioManifest) {
  return {
    input_video: videoPath,
    audio_tracks: (audioManifest.scene_audio ?? []).map((scene) => scene.audio_path),
    output_video_with_audio: videoPath.replace('.mp4', '.audio.mp4'),
    ffmpeg_command: `ffmpeg -i ${videoPath} -i narration.wav -c:v copy -c:a aac ${videoPath.replace('.mp4', '.audio.mp4')}`,
    merge_hash: sha256Hash({ videoPath, audioManifest }),
    deterministic: true,
  };
}

export function burnCaptions(videoPath, vttPath = 'outputs/captions.vtt') {
  return {
    input_video: videoPath,
    captions: vttPath,
    output_video_with_captions: videoPath.replace('.mp4', '.captioned.mp4'),
    ffmpeg_command: `ffmpeg -i ${videoPath} -vf subtitles=${vttPath} ${videoPath.replace('.mp4', '.captioned.mp4')}`,
    deterministic: true,
  };
}

export function exportMp4(finalVideoPath) {
  return {
    output_path: finalVideoPath,
    format: 'mp4',
    deterministic: true,
  };
}
