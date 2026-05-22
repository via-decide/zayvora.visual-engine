import { ClaimExtractor } from './claim_extractor.js';
import { CitationMapper } from './citation_mapper.js';
import { EvidenceGraph } from './evidence_graph.js';

export class EvidenceExtractor {
  constructor({ claimExtractor = new ClaimExtractor(), citationMapper = new CitationMapper(), evidenceGraph = new EvidenceGraph() } = {}) {
    this.claimExtractor = claimExtractor;
    this.citationMapper = citationMapper;
    this.evidenceGraph = evidenceGraph;
  }

  extract(resources = []) {
    const claims = this.claimExtractor.extractClaims(resources);
    const mappedClaims = this.citationMapper.mapClaimsToEvidence(claims, resources);
    const graph = this.evidenceGraph.build(mappedClaims);

    return { claims: mappedClaims, graph };
  }
}
