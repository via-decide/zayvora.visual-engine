import test from 'node:test';
import assert from 'node:assert/strict';
import { creatorWorkflowToVisualContract } from '../integrations/creator_bridge.js';

test('creator bridge maps templates/platforms and produces compatible deterministic contract', () => {
  const workflow = {
    prompt: 'Launch campaign recap',
    platform: 'shorts',
    target: 'json',
    template: {
      request_id: 'CREATOR-REQ-777',
      template_id: 'TEMP-ALPHA',
      title: 'Campaign Template',
      blocks: [
        {
          block_id: 'B1',
          type: 'hook',
          duration_frames: 90,
          layers: [
            { layer_id: 'L1', type: 'text', content: 'Hook line', position: { x: 80, y: 120 }, dimensions: { width: 900, height: 180 } },
          ],
        },
        {
          block_id: 'B2',
          type: 'detail',
          duration_frames: 120,
          layers: [
            { layer_id: 'L2', type: 'text', content: 'Detail line', position: { x: 80, y: 400 }, dimensions: { width: 900, height: 180 } },
          ],
        },
      ],
    },
  };

  const result = creatorWorkflowToVisualContract(workflow);

  assert.equal(result.platform, 'shorts');
  assert.equal(result.render_contract.width, 1080);
  assert.equal(result.render_contract.height, 1920);
  assert.equal(result.scene_graph.scenes.length, 2);
  assert.equal(result.template_structure.compatible, true);
  assert.equal(result.compatible, true);
  assert.equal(Boolean(result.render_contract.render_hash), true);
});
