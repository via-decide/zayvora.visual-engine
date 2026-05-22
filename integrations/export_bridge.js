import { sha256Hash } from '../visual/visual_hash.js';

export function exportArtifacts({ request_id, render_contract, output_manifest, artifacts = [] }) {
  return {
    request_id,
    render_contract_hash: render_contract.render_hash,
    manifest_hash: output_manifest.manifest_hash,
    files: artifacts,
    export_hash: sha256Hash({ request_id, artifacts, manifest_hash: output_manifest.manifest_hash }),
    deterministic: true,
  };
}
