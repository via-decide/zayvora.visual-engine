import { renderFromContract } from '../remotion/render_remotion.js';
import { sha256Hash } from '../visual/visual_hash.js';

export function prepareRemotionInput({ render_contract, scene_graph, timeline, asset_manifest = { assets: [] } }) {
  return {
    render_contract: { ...render_contract, contract_hash: render_contract.render_hash },
    scene_graph,
    timeline,
    asset_manifest,
  };
}

export function invokeRemotionRenderer(remotionInput, outputPath = 'outputs/video.mp4') {
  return renderFromContract(remotionInput, outputPath);
}

export function collectRenderArtifacts(remotionResult) {
  return {
    files: [remotionResult.output_path, remotionResult.manifest_path],
    hashes: {
      contract_hash: remotionResult.contract_hash,
      manifest_hash: remotionResult.manifest_hash,
    },
    deterministic: true,
  };
}

export function verifyVideoOutput(remotionResult) {
  return Boolean(remotionResult?.output_path && remotionResult?.contract_hash && remotionResult?.manifest_hash && sha256Hash(remotionResult));
}
