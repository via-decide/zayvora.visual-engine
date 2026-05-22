import { dispatchRender } from '../pipeline/render_dispatcher.js';
import { createOutputManifest } from '../pipeline/output_manifest.js';

const SUPPORTED_TARGETS = ['html', 'remotion', 'json', 'preview'];

export class RenderTargetRouter {
  resolveTarget(target = 'preview') {
    return target;
  }

  validateTarget(target) {
    return SUPPORTED_TARGETS.includes(target);
  }

  dispatch({ target, render_contract, scene_graph, timeline, asset_manifest = { assets: [] }, prompt }) {
    const resolved = this.resolveTarget(target);
    if (!this.validateTarget(resolved)) {
      throw new Error(`Unsupported target: ${resolved}`);
    }
    return dispatchRender(render_contract, {
      renderer: resolved,
      scene_graph,
      timeline,
      asset_manifest,
    });
  }

  returnOutputManifest({ request_id, prompt, scene_graph, timeline, render_contract, output }) {
    return createOutputManifest({
      request_id,
      prompt,
      scene_graph,
      timeline,
      render_contract,
      outputs: [output],
    });
  }
}
