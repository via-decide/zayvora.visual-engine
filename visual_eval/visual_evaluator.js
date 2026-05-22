import { detectOverflow, detectLayerCollision, scoreAlignment, scoreSpacing, scoreReadableText, scoreViewportFit } from './layout_metrics.js';
import { frameContinuity, transitionValidity, durationConsistency, keyframeValidity, sceneOrderingScore } from './timeline_metrics.js';
import { compareSnapshotHashes, hashFrameModel, hashRenderContract } from './snapshot_hasher.js';

export class VisualEvaluator {
  evaluateSceneGraph(sceneGraph, viewport = { width: 1920, height: 1080 }) {
    const overflow = detectOverflow(sceneGraph, viewport);
    const collisions = detectLayerCollision(sceneGraph);
    const layout_score = (scoreAlignment(sceneGraph) + scoreSpacing(sceneGraph) + scoreReadableText(sceneGraph) + scoreViewportFit(sceneGraph, viewport)) / 4;
    return { valid: overflow.length === 0, overflow_count: overflow.length, collision_count: collisions.length, layout_score };
  }

  evaluateTimeline(timeline) {
    const continuity = frameContinuity(timeline);
    const timeline_score = (Number(continuity.valid) + transitionValidity(timeline) + durationConsistency(timeline) + keyframeValidity(timeline) + sceneOrderingScore(timeline)) / 5;
    return { valid: continuity.valid, gaps: continuity.gaps, timeline_score };
  }

  evaluateRenderContract(renderContract) {
    const required = ['request_id', 'render_hash', 'timeline_hash', 'scene_graph_hash'];
    const valid = required.every((field) => renderContract[field]);
    return { valid, contract_hash: hashRenderContract(renderContract) };
  }

  evaluateAssetManifest(assetManifest) {
    const assets = assetManifest.assets ?? [];
    const valid = assets.every((asset) => asset.asset_id && asset.hash && Array.isArray(asset.usage));
    return { valid, asset_score: valid ? 1 : 0 };
  }

  evaluateFrameDeterminism(frameModelA, frameModelB) {
    const hashA = hashFrameModel(frameModelA);
    const hashB = hashFrameModel(frameModelB);
    const cmp = compareSnapshotHashes(hashA, hashB);
    return { valid: cmp.identical, determinism_score: cmp.identical ? 1 : 0, ...cmp };
  }

  calculateOverallScore({ sceneResult, timelineResult, assetResult, frameResult, contractResult }) {
    const overall_score = (sceneResult.layout_score + timelineResult.timeline_score + assetResult.asset_score + frameResult.determinism_score + Number(contractResult.valid)) / 5;
    return overall_score;
  }
}
