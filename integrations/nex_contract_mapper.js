import { sha256Hash } from '../visual/visual_hash.js';

export function mapNexToEcosystemContract({ normalized, beats, citations, render_contract }) {
  const contract = {
    request_id: normalized.request_id,
    source: 'nex',
    context_manifest: {
      title: normalized.title,
      section_count: normalized.sections.length,
      claim_count: normalized.claims.length,
    },
    research_output: {
      claims: normalized.claims,
      sources: citations,
      sections: normalized.sections,
      beats,
    },
    storyboard: {
      beats,
      citation_count: citations.length,
    },
    scene_graph: render_contract.scenes ? { scenes: render_contract.scenes, scene_graph_hash: render_contract.scene_graph_hash } : {},
    timeline: render_contract.timeline ?? {},
    audio_manifest: {},
    asset_manifest: render_contract.assets ?? {},
    render_contract,
  };
  contract.hash = sha256Hash(contract);
  return contract;
}
