import { VisualOrchestrator } from '../pipeline/visual_orchestrator.js';
import { RenderTargetRouter } from './render_target_router.js';
import { VisualTraceLogger } from './visual_trace_logger.js';
import { contractToHTMLCarousel, verifyHTMLParity } from '../integrations/html_visual_bridge.js';
import { prepareRemotionInput, invokeRemotionRenderer, collectRenderArtifacts, verifyVideoOutput } from '../integrations/remotion_bridge.js';
import { exportArtifacts } from '../integrations/export_bridge.js';

export class VisualGenerationEngine {
  constructor(config = {}) {
    this.orchestrator = new VisualOrchestrator(config);
    this.router = new RenderTargetRouter();
    this.traceLogger = new VisualTraceLogger();
    this.config = config;
  }

  generateFromPrompt(prompt, options = {}) {
    const scene_graph = this.orchestrator.generateSceneGraph(prompt);
    const timeline = this.orchestrator.generateTimeline(scene_graph);
    const render_contract = this.generateRenderContract(scene_graph, timeline, options);
    const output = this.router.dispatch({
      target: options.target ?? this.config.renderer ?? 'preview',
      render_contract,
      scene_graph,
      timeline,
      prompt,
    });
    const output_manifest = this.router.returnOutputManifest({
      request_id: scene_graph.request_id,
      prompt,
      scene_graph,
      timeline,
      render_contract,
      output,
    });
    const trace = this.traceLogger.logTrace({
      prompt,
      enrichment: { normalized_intent: scene_graph.normalized_intent },
      scene_graph,
      timeline,
      render_contract,
      renderer_target: options.target ?? this.config.renderer ?? 'preview',
      output_manifest,
    });
    return { request_id: scene_graph.request_id, scene_graph, timeline, render_contract, output, output_manifest, trace, deterministic: true };
  }

  generateFromStructuredInput(input, options = {}) {
    const prompt = input.prompt ?? 'Structured visual request';
    return this.generateFromPrompt(prompt, options);
  }

  generateRenderContract(scene_graph, timeline, options = {}) {
    return this.orchestrator.generateRenderContract(scene_graph, timeline, options);
  }

  renderHTML(render_contract) {
    const html = contractToHTMLCarousel(render_contract);
    return { html, parity_ok: verifyHTMLParity(render_contract, html), deterministic: true };
  }

  renderVideo(render_contract, scene_graph, timeline) {
    const remotionInput = prepareRemotionInput({ render_contract, scene_graph, timeline, asset_manifest: { assets: [] } });
    const result = invokeRemotionRenderer(remotionInput);
    return {
      remotion: result,
      artifacts: collectRenderArtifacts(result),
      verified: verifyVideoOutput(result),
      deterministic: true,
    };
  }

  exportArtifacts(request_id, render_contract, output_manifest, artifacts) {
    return exportArtifacts({ request_id, render_contract, output_manifest, artifacts });
  }

  verifyGenerationTrace(trace) {
    return this.traceLogger.verifyTrace(trace);
  }
}
