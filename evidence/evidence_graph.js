export class EvidenceGraph {
  build(mappedClaims = []) {
    const nodes = [];
    const edges = [];

    for (const claim of mappedClaims) {
      nodes.push({ id: claim.claim_id, type: 'claim', label: claim.claim, verified: claim.verified });
      for (const sourceId of claim.source_ids) {
        if (!nodes.find((n) => n.id === sourceId)) {
          nodes.push({ id: sourceId, type: 'source' });
        }
        edges.push({ from: claim.claim_id, to: sourceId, relation: 'supported_by' });
      }
    }

    return { nodes, edges };
  }
}
