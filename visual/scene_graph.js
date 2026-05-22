import { sha256Hash } from './visual_hash.js';

export class SceneGraphBuilder {
  constructor() {
    this.sceneGraph = this.createSceneGraph();
  }

  createSceneGraph() {
    this.sceneGraph = { scenes: [] };
    return this.sceneGraph;
  }

  addScene(scene) {
    this.sceneGraph.scenes.push({ ...scene, layers: scene.layers ?? [] });
    return this;
  }

  addLayer(sceneId, layer) {
    const scene = this.sceneGraph.scenes.find((item) => item.scene_id === sceneId);
    if (!scene) throw new Error(`Scene not found: ${sceneId}`);
    scene.layers.push(layer);
    return this;
  }

  addTextNode(sceneId, layerId, content, position, style = {}, motion = {}) {
    return this.addLayer(sceneId, { layer_id: layerId, type: 'text', content, position, style, motion });
  }

  addShapeNode(sceneId, layerId, shape, position, style = {}, motion = {}) {
    return this.addLayer(sceneId, { layer_id: layerId, type: 'shape', shape, position, style, motion });
  }

  addImageNode(sceneId, layerId, assetId, position, style = {}, motion = {}) {
    return this.addLayer(sceneId, { layer_id: layerId, type: 'image', asset_id: assetId, position, style, motion });
  }

  addMotionNode(sceneId, layerId, targetLayerId, keyframes) {
    return this.addLayer(sceneId, { layer_id: layerId, type: 'motion', target_layer_id: targetLayerId, keyframes });
  }

  validateSceneGraph() {
    for (const scene of this.sceneGraph.scenes) {
      if (!scene.scene_id || !Number.isInteger(scene.duration_frames)) return false;
      for (const layer of scene.layers) {
        if (!layer.layer_id || !layer.type) return false;
      }
    }
    return true;
  }

  hashSceneGraph() {
    return sha256Hash(this.sceneGraph);
  }
}
