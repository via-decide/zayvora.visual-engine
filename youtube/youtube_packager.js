import { generateMetadataPackage } from './metadata_generator.js';
import { generateChaptersFromTimeline, chaptersToDescription } from './chapter_generator.js';
import { generateThumbnailPlan } from './thumbnail_generator.js';
import { exportSrt } from '../captions/srt_exporter.js';
import { sha256Hash } from '../visual/visual_hash.js';

export function packageYouTubeExport({
  render_result,
  caption_payload,
  context = {},
}) {
  const metadata = generateMetadataPackage(context);
  const scenes = render_result.scene_graph?.scenes ?? [];
  const timeline = render_result.timeline ?? {};
  const chapters = generateChaptersFromTimeline(timeline, scenes);
  const chapterText = chaptersToDescription(chapters);
  const thumbnail = generateThumbnailPlan({ title: metadata.title, scene_graph: render_result.scene_graph });
  const srt = exportSrt(caption_payload);

  const descriptionTxt = `${metadata.description}\n\nChapters:\n${chapterText}`.trim();

  const output = {
    video_mp4: render_result.mux?.final_video_path ?? render_result.manifest?.final_video_path ?? 'outputs/video.mp4',
    captions_srt: 'outputs/captions.srt',
    thumbnail_png: thumbnail.output_path,
    metadata_json: 'outputs/metadata.json',
    description_txt: 'outputs/description.txt',
    metadata,
    chapters,
    thumbnail,
    srt,
    description: descriptionTxt,
    deterministic: true,
  };
  output.package_hash = sha256Hash(output);
  return output;
}
