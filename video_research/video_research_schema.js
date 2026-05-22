import crypto from 'node:crypto';

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value)).digest('hex')}`;
}

export class VideoResearchPackage {
  constructor({ packageId, topic, videoTitleOptions, hookOptions, talkingPoints, sourceCards, citations, sectionEvidence, sourceManifestHash, briefHash, contractReady = true }) {
    this.package_id = packageId;
    this.topic = topic;
    this.video_title_options = videoTitleOptions;
    this.hook_options = hookOptions;
    this.talking_points = talkingPoints;
    this.source_cards = sourceCards;
    this.citations = citations;
    this.section_evidence = sectionEvidence;
    this.source_manifest_hash = sourceManifestHash;
    this.brief_hash = briefHash;
    this.contract_ready = contractReady;
    this.package_hash = sha256(JSON.stringify(this.toJSONCore()));
  }

  toJSONCore() {
    return {
      package_id: this.package_id,
      topic: this.topic,
      video_title_options: this.video_title_options,
      hook_options: this.hook_options,
      talking_points: this.talking_points,
      source_cards: this.source_cards,
      citations: this.citations,
      section_evidence: this.section_evidence,
      source_manifest_hash: this.source_manifest_hash,
      brief_hash: this.brief_hash,
      contract_ready: this.contract_ready,
    };
  }

  toJSON() {
    return { ...this.toJSONCore(), package_hash: this.package_hash };
  }
}

export { sha256 };
