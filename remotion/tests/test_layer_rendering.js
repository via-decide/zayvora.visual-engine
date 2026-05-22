import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLayer } from '../LayerRenderer.js';

test('layer rendering is deterministic for text/shape/image', () => {
  const text = renderLayer({ layer_id: 'T', type: 'text', content: 'Hello', position: { x: 1, y: 2 }, style: {} }, 0);
  const shape = renderLayer({ layer_id: 'S', type: 'shape', shape: 'rect', position: { x: 0, y: 0 }, style: {} }, 0);
  const image = renderLayer({ layer_id: 'I', type: 'image', asset_id: 'A1', path: '/tmp/a.png', position: { x: 2, y: 3 } }, 0);
  assert.equal(text.deterministic, true);
  assert.equal(shape.deterministic, true);
  assert.equal(image.deterministic, true);
  assert.equal(text.style.fontFamily.includes('Arial'), true);
});
