import { mapTemplateToSceneGraph, preserveTemplateStructure } from './template_mapper.js';
import { mapPlatformConfig, validatePlatform } from './platform_mapper.js';
import { sceneGraphToTimeline } from '../pipeline/scene_to_timeline.js';
import { timelineToRenderContract } from '../pipeline/timeline_to_contract.js';
import { sha256Hash } from '../visual/visual_hash.js';

export function creatorWorkflowToVisualContract(workflow = {}) {
  const platform = workflow.platform ?? 'youtube';
  if (!validatePlatform(platform)) {
    throw new Error(`Unsupported creator platform: ${platform}`);
  }

  const platformConfig = mapPlatformConfig(platform);
  const template = workflow.template ?? {};
  const mappedTemplate = mapTemplateToSceneGraph(template);

  const scene_graph = {
    schema_version: '1.0.0',
    request_id: mappedTemplate.request_id,
    prompt: workflow.prompt ?? mappedTemplate.title,
    normalized_intent: {
      source: 'creator-tool',
      platform,
      template_id: mappedTemplate.template_id,
    },
    scenes: mappedTemplate.scenes,
    deterministic: true,
  };
  scene_graph.scene_graph_hash = sha256Hash(scene_graph);

  const timeline = sceneGraphToTimeline(scene_graph, {
    fps: platformConfig.fps,
    scene_duration_frames: workflow.scene_duration_frames ?? 120,
    transition_frames: workflow.transition_frames ?? 15,
  });

  const render_contract = timelineToRenderContract({
    request_id: scene_graph.request_id,
    prompt: scene_graph.prompt,
    normalized_intent: scene_graph.normalized_intent,
    scene_graph,
    timeline,
    assets: workflow.asset_manifest ?? { assets: [] },
    format: platformConfig.format,
    dimensions: { width: platformConfig.width, height: platformConfig.height },
    renderer: workflow.target ?? 'remotion',
  });

  const structure = preserveTemplateStructure(template, scene_graph);
  const compatible = structure.compatible && render_contract.width === platformConfig.width && render_contract.height === platformConfig.height;

  return {
    platform,
    platform_config: platformConfig,
    scene_graph,
    timeline,
    render_contract,
    template_structure: structure,
    compatible,
    deterministic: true,
  };
}
