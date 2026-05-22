import { renderFromContract } from '../remotion/render_remotion.js';

export function validateRendererSupport(renderer) {
  return ['html', 'remotion', 'json', 'preview'].includes(renderer);
}

export function dispatchToHTML(contract) {
  return { renderer: 'html', contract_hash: contract.render_hash, deterministic: true, payload: contract };
}

export function dispatchToRemotion(contract, scene_graph, timeline, asset_manifest = { assets: [] }) {
  return renderFromContract({
    render_contract: { ...contract, contract_hash: contract.render_hash },
    scene_graph,
    timeline,
    asset_manifest,
  });
}

export function dispatchToJSON(contract) {
  return { renderer: 'json', contract_hash: contract.render_hash, deterministic: true, payload: JSON.stringify(contract) };
}

export function dispatchRender(contract, options = {}) {
  const target = options.renderer ?? contract.renderer ?? 'preview';
  if (!validateRendererSupport(target)) {
    throw new Error(`Unsupported renderer: ${target}`);
  }
  if (target === 'html') return dispatchToHTML(contract);
  if (target === 'remotion') return dispatchToRemotion(contract, options.scene_graph, options.timeline, options.asset_manifest);
  if (target === 'json') return dispatchToJSON(contract);
  return { renderer: 'preview', contract_hash: contract.render_hash, deterministic: true, payload: contract };
}
