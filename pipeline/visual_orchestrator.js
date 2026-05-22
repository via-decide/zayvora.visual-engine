import { promptToSceneGraph } from './prompt_to_scene.js';
import { sceneGraphToTimeline } from './scene_to_timeline.js';
import { timelineToRenderContract } from './timeline_to_contract.js';
import { dispatchRender } from './render_dispatcher.js';
import { createOutputManifest } from './output_manifest.js';

export class VisualOrchestrator {
  constructor(config = {}) {
    this.config = {
      renderer: 'preview',
      dimensions: { width: 1920, height: 1080 },
      format: '16:9',
      fps: 30,
      scene_duration_frames: 120,
      transition_frames: 15,
      ...config,
    };
  }

  generateVisualPlan(prompt) {
    return promptToSceneGraph(prompt, this.config);
  }

  generateSceneGraph(prompt) {
    return this.generateVisualPlan(prompt);
  }

  generateTimeline(scene_graph) {
    return sceneGraphToTimeline(scene_graph, this.config);
  }

  generateRenderContract(scene_graph, timeline) {
    return timelineToRenderContract({
      request_id: scene_graph.request_id,
      prompt: scene_graph.prompt,
      normalized_intent: scene_graph.normalized_intent,
      scene_graph,
      timeline,
      assets: { assets: [] },
      format: this.config.format,
      dimensions: this.config.dimensions,
      renderer: this.config.renderer === 'preview' ? 'remotion' : this.config.renderer,
    });
  }

  dispatchRender(render_contract, scene_graph, timeline) {
    return dispatchRender(render_contract, {
      renderer: this.config.renderer,
      scene_graph,
      timeline,
      asset_manifest: { assets: [] },
    });
  }

  generateOutputManifest(request_id, prompt, scene_graph, timeline, render_contract, render_output) {
    return createOutputManifest({
      request_id,
      prompt,
      scene_graph,
      timeline,
      render_contract,
      outputs: [render_output],
    });
  }
}
