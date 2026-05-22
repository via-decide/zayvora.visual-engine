import { ResearchBrief } from './brief_schema.js';
import { BriefSectionBuilder } from './brief_section_builder.js';
import { CitationTableBuilder } from './citation_table_builder.js';
import { ResearchSummaryWriter } from './research_summary_writer.js';

export class ResearchBriefGenerator {
  constructor({ sectionBuilder = new BriefSectionBuilder(), citationTableBuilder = new CitationTableBuilder(), summaryWriter = new ResearchSummaryWriter() } = {}) {
    this.sectionBuilder = sectionBuilder;
    this.citationTableBuilder = citationTableBuilder;
    this.summaryWriter = summaryWriter;
  }

  generate({ topic, mappedClaims = [], contradictions = [], sourceManifestHash, briefId = 'BRIEF-001' }) {
    const keyClaims = this.sectionBuilder.buildKeyClaims(mappedClaims);
    const evidenceTable = this.citationTableBuilder.build(mappedClaims);
    const openQuestions = this.sectionBuilder.buildOpenQuestions(mappedClaims);
    const videoAngles = this.sectionBuilder.buildVideoAngles(topic, mappedClaims, contradictions);
    const summary = this.summaryWriter.write({ topic, claims: keyClaims, contradictions, openQuestions });

    return new ResearchBrief({
      briefId,
      topic,
      summary,
      keyClaims,
      evidenceTable,
      contradictions,
      videoAngles,
      openQuestions,
      sourceManifestHash,
    });
  }
}
