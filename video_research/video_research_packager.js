import { VideoResearchPackage } from './video_research_schema.js';
import { VideoAngleGenerator } from './video_angle_generator.js';
import { TalkingPointsBuilder } from './talking_points_builder.js';
import { SourceCardGenerator } from './source_card_generator.js';

export class VideoResearchPackager {
  constructor({ angleGenerator = new VideoAngleGenerator(), talkingPointsBuilder = new TalkingPointsBuilder(), sourceCardGenerator = new SourceCardGenerator() } = {}) {
    this.angleGenerator = angleGenerator;
    this.talkingPointsBuilder = talkingPointsBuilder;
    this.sourceCardGenerator = sourceCardGenerator;
  }

  packageFromBrief(brief, options = {}) {
    const topic = brief.topic || options.topic || 'Untitled Topic';
    const videoTitleOptions = this.angleGenerator.generate(topic, brief.key_claims || [], brief.contradictions || []);
    const hookOptions = this.angleGenerator.generateHooks(topic, brief.key_claims || []);
    const talkingPoints = this.talkingPointsBuilder.build(brief);
    const sourceCards = this.sourceCardGenerator.build(brief.evidence_table || []);
    const sectionEvidence = this.talkingPointsBuilder.buildSectionEvidence(brief);

    return new VideoResearchPackage({
      packageId: options.packageId || 'VRP-001',
      topic,
      videoTitleOptions,
      hookOptions,
      talkingPoints,
      sourceCards,
      citations: brief.evidence_table || [],
      sectionEvidence,
      sourceManifestHash: brief.source_manifest_hash || '',
      briefHash: brief.brief_hash || '',
      contractReady: true,
    });
  }
}
