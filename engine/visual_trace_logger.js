import { buildVisualTrace } from '../integrations/visual_trace_bridge.js';

export class VisualTraceLogger {
  logTrace(input) {
    return buildVisualTrace(input);
  }

  verifyTrace(trace) {
    const required = [
      'prompt_hash',
      'enrichment_hash',
      'scene_graph_hash',
      'timeline_hash',
      'render_contract_hash',
      'renderer_target',
      'output_hash',
    ];
    return required.every((key) => Boolean(trace[key]));
  }
}
