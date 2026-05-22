import crypto from 'node:crypto';

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value)).digest('hex')}`;
}

export class ResearchBrief {
  constructor({ briefId, topic, summary, keyClaims, evidenceTable, contradictions, videoAngles, openQuestions, sourceManifestHash }) {
    this.brief_id = briefId;
    this.topic = topic;
    this.summary = summary;
    this.key_claims = keyClaims;
    this.evidence_table = evidenceTable;
    this.contradictions = contradictions;
    this.video_angles = videoAngles;
    this.open_questions = openQuestions;
    this.source_manifest_hash = sourceManifestHash;
    this.brief_hash = sha256(JSON.stringify(this.toJSONCore()));
  }

  toJSONCore() {
    return {
      brief_id: this.brief_id,
      topic: this.topic,
      summary: this.summary,
      key_claims: this.key_claims,
      evidence_table: this.evidence_table,
      contradictions: this.contradictions,
      video_angles: this.video_angles,
      open_questions: this.open_questions,
      source_manifest_hash: this.source_manifest_hash,
    };
  }

  toJSON() {
    return { ...this.toJSONCore(), brief_hash: this.brief_hash };
  }
}

export { sha256 };
