import { SourceDiscoveryEngine } from '../research/source_discovery_engine.js';
import { WebIngestor } from '../ingestion/web_ingestor.js';
import { EvidenceExtractor } from '../evidence/evidence_extractor.js';
import { SourceQualityScorer } from '../research_quality/source_quality_scorer.js';
import { ContradictionDetector } from '../research_quality/contradiction_detector.js';
import { ResearchBriefGenerator } from '../briefs/research_brief_generator.js';
import { VideoResearchPackager } from '../video_research/video_research_packager.js';
import { ResearchVerifier } from '../verification/research_verifier.js';
import { VisualEngineHandoff } from '../integrations/visual_engine_handoff.js';

export class ResearchOrchestrator {
  constructor({
    sourceDiscoveryEngine = new SourceDiscoveryEngine(),
    webIngestor = new WebIngestor(),
    evidenceExtractor = new EvidenceExtractor(),
    sourceQualityScorer = new SourceQualityScorer(),
    contradictionDetector = new ContradictionDetector(),
    briefGenerator = new ResearchBriefGenerator(),
    videoPackager = new VideoResearchPackager(),
    researchVerifier = new ResearchVerifier(),
    visualEngineHandoff = new VisualEngineHandoff(),
  } = {}) {
    this.sourceDiscoveryEngine = sourceDiscoveryEngine;
    this.webIngestor = webIngestor;
    this.evidenceExtractor = evidenceExtractor;
    this.sourceQualityScorer = sourceQualityScorer;
    this.contradictionDetector = contradictionDetector;
    this.briefGenerator = briefGenerator;
    this.videoPackager = videoPackager;
    this.researchVerifier = researchVerifier;
    this.visualEngineHandoff = visualEngineHandoff;
  }

  async run(input, options = {}) {
    const discovered = await this.sourceDiscoveryEngine.discover(input, options.discovery || {});
    const discoveryJson = discovered.toJSON();

    const ingestionPlan = discoveryJson.sources.map((src, i) => ({
      sourceId: src.source_id || `SRC-${String(i + 1).padStart(3, '0')}`,
      url: src.url,
      sourceType: src.sourceType === 'pdfs' ? 'pdf' : src.sourceType === 'transcripts' ? 'transcript' : 'article',
      transcript: options.transcriptByUrl?.[src.url] || null,
    }));

    const ingestionManifest = await this.webIngestor.ingestBatch(ingestionPlan, options.ingestion || {});
    const ingested = ingestionManifest.toJSON().resources;

    const evidence = this.evidenceExtractor.extract(ingested);
    const scored = this.sourceQualityScorer.rank(ingested, { query: String(input), now: options.now || new Date() });
    const contradictions = this.contradictionDetector.detect(evidence.claims);

    const brief = this.briefGenerator.generate({
      topic: String(input),
      mappedClaims: evidence.claims,
      contradictions,
      sourceManifestHash: discoveryJson.hash,
      briefId: options.briefId || 'BRIEF-001',
    }).toJSON();

    const videoPackage = this.videoPackager.packageFromBrief(brief, { packageId: options.packageId || 'VRP-001' }).toJSON();
    const verification = this.researchVerifier.verify({ packageData: videoPackage, ingestedSources: ingested, options: options.verification || {} }).toJSON();
    this.researchVerifier.assertReady(verification);
    const handoff = this.visualEngineHandoff.build({ packageData: videoPackage, verificationReport: verification });

    return {
      source_discovery: discoveryJson,
      ingestion_manifest: ingestionManifest.toJSON(),
      evidence,
      source_quality: scored,
      contradictions,
      research_brief: brief,
      video_research_package: videoPackage,
      verification_report: verification,
      visual_engine_handoff: handoff,
    };
  }
}
