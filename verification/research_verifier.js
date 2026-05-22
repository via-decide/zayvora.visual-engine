import { CitationVerifier } from './citation_verifier.js';
import { UnsupportedClaimDetector } from './unsupported_claim_detector.js';
import { SourceCoverageChecker } from './source_coverage_checker.js';
import { VerificationReport } from './verification_report.js';

export class ResearchVerifier {
  constructor({ citationVerifier = new CitationVerifier(), unsupportedClaimDetector = new UnsupportedClaimDetector(), sourceCoverageChecker = new SourceCoverageChecker() } = {}) {
    this.citationVerifier = citationVerifier;
    this.unsupportedClaimDetector = unsupportedClaimDetector;
    this.sourceCoverageChecker = sourceCoverageChecker;
  }

  verify({ packageData, ingestedSources = [], options = {} }) {
    const talkingPoints = packageData?.talking_points || [];
    const sectionEvidence = packageData?.section_evidence || [];
    const citations = packageData?.citations || [];

    const unsupportedClaims = this.unsupportedClaimDetector.detect(talkingPoints, sectionEvidence);
    const citationCheck = this.citationVerifier.verify(citations, ingestedSources);
    const weakSources = this.sourceCoverageChecker.check(ingestedSources, options);

    const verified = unsupportedClaims.length === 0 && citationCheck.invalid.length === 0 && weakSources.length === 0;

    return new VerificationReport({
      verified,
      unsupportedClaims,
      weakSources,
      citationCoverage: citationCheck.coverage,
      readyForVideo: verified,
      details: {
        invalid_citations: citationCheck.invalid,
        citation_valid_count: citationCheck.validCount,
        citation_total: citationCheck.total,
      },
    });
  }

  assertReady(result) {
    const report = typeof result.toJSON === 'function' ? result.toJSON() : result;
    if (!report.ready_for_video) {
      throw new Error('Verification gate failed: export blocked due to unsupported claims/citation/source coverage issues.');
    }
    return true;
  }
}
