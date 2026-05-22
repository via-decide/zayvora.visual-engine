import { sha256Hash } from '../visual/visual_hash.js';

export function createRenderManifest({ request_id, render_contract, frames_hash, mux_result }) {
  const manifest = {
    request_id,
    render_contract_hash: render_contract.render_hash,
    frames_hash,
    final_video_path: mux_result.final_video_path,
    output_format: 'mp4',
    deterministic: true,
  };
  manifest.render_manifest_hash = sha256Hash(manifest);
  return manifest;
}

export function verifyRenderHash(manifest) {
  const { render_manifest_hash, ...rest } = manifest;
  return render_manifest_hash === sha256Hash(rest);
}
