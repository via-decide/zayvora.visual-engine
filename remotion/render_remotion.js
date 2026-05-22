import fs from 'node:fs';
import path from 'node:path';
import { sha256Hash } from '../visual/visual_hash.js';
import { registerComposition } from './Root.js';

export function verifyRenderInput(input) {
  const required = ['render_contract', 'scene_graph', 'timeline', 'asset_manifest'];
  return required.every((field) => input[field]);
}

export function writeRenderManifest(manifest, outputDir = 'outputs') {
  fs.mkdirSync(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${manifest.render_id}.manifest.json`);
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2));
  return filePath;
}

export function renderPreview(input) {
  const comp = registerComposition(input.render_contract);
  return { mode: 'preview', composition: comp, deterministic: true };
}

export function renderStill(input, frame = 0) {
  return { mode: 'still', frame, contract_hash: input.render_contract.contract_hash, deterministic: true };
}

export function renderMP4(input, outputPath = 'outputs/video.mp4') {
  return {
    mode: 'mp4',
    output_path: outputPath,
    frames: input.render_contract.duration_frames,
    fps: input.render_contract.fps,
    deterministic: true,
  };
}

export function renderFromContract(input, outputPath = 'outputs/video.mp4') {
  if (!verifyRenderInput(input)) throw new Error('invalid render input');
  const result = renderMP4(input, outputPath);
  const manifest = {
    render_id: `VIDEO-${input.render_contract.contract_id ?? '001'}`,
    contract_hash: input.render_contract.contract_hash ?? sha256Hash(input.render_contract),
    output_path: result.output_path,
    frames: result.frames,
    fps: result.fps,
    deterministic: true,
  };
  manifest.manifest_hash = sha256Hash(manifest);
  manifest.manifest_path = writeRenderManifest(manifest);
  return manifest;
}
