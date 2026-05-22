import { sha256Hash } from '../visual/visual_hash.js';
import { detectOverflow } from './layout_metrics.js';

export function compareRenderContracts(previousContract, currentContract) {
  const previousHash = previousContract.render_hash ?? sha256Hash(previousContract);
  const currentHash = currentContract.render_hash ?? sha256Hash(currentContract);
  return { changed: previousHash !== currentHash, previous: previousHash, current: currentHash };
}

export function compareSceneGraphs(previousSceneGraph, currentSceneGraph) {
  const previousHash = previousSceneGraph.scene_graph_hash ?? sha256Hash(previousSceneGraph);
  const currentHash = currentSceneGraph.scene_graph_hash ?? sha256Hash(currentSceneGraph);
  return { changed: previousHash !== currentHash, previous: previousHash, current: currentHash };
}

export function compareTimelineHashes(previousTimeline, currentTimeline) {
  const previousHash = previousTimeline.timeline_hash ?? sha256Hash(previousTimeline);
  const currentHash = currentTimeline.timeline_hash ?? sha256Hash(currentTimeline);
  return { changed: previousHash !== currentHash, previous: previousHash, current: currentHash };
}

export function detectLayoutRegression(previousSceneGraph, currentSceneGraph, viewport = { width: 1920, height: 1080 }) {
  const previous = detectOverflow(previousSceneGraph, viewport).length;
  const current = detectOverflow(currentSceneGraph, viewport).length;
  return {
    regression_detected: current > previous,
    metric: 'layout_overflow',
    previous,
    current,
  };
}

export function generateRegressionReport(previousState, currentState) {
  const contractComparison = compareRenderContracts(previousState.render_contract, currentState.render_contract);
  const sceneComparison = compareSceneGraphs(previousState.scene_graph, currentState.scene_graph);
  const timelineComparison = compareTimelineHashes(previousState.timeline, currentState.timeline);
  const layoutRegression = detectLayoutRegression(previousState.scene_graph, currentState.scene_graph, currentState.viewport);
  return {
    regression_detected: layoutRegression.regression_detected || contractComparison.changed || timelineComparison.changed,
    contract_comparison: contractComparison,
    scene_graph_comparison: sceneComparison,
    timeline_comparison: timelineComparison,
    layout_regression: layoutRegression,
  };
}
