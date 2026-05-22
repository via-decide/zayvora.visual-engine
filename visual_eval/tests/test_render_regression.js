import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRegressionReport } from '../render_regression.js';

test('regression detection reports increased overflow and contract changes', () => {
  const previous = {
    render_contract: { request_id: 'VISUAL-001', render_hash: 'sha256:a', timeline_hash: 'sha256:t1', scene_graph_hash: 'sha256:s1' },
    scene_graph: { scenes: [{ scene_id: 'S', layers: [{ layer_id: 'L1', position: { x: 0, y: 0 }, dimensions: { width: 100, height: 100 } }] }] },
    timeline: { timeline_hash: 'sha256:t1' },
    viewport: { width: 1920, height: 1080 },
  };
  const current = {
    render_contract: { request_id: 'VISUAL-001', render_hash: 'sha256:b', timeline_hash: 'sha256:t2', scene_graph_hash: 'sha256:s2' },
    scene_graph: { scenes: [{ scene_id: 'S', layers: [{ layer_id: 'L1', position: { x: 1910, y: 1070 }, dimensions: { width: 100, height: 100 } }] }] },
    timeline: { timeline_hash: 'sha256:t2' },
    viewport: { width: 1920, height: 1080 },
  };
  const report = generateRegressionReport(previous, current);
  assert.equal(report.regression_detected, true);
  assert.equal(report.layout_regression.metric, 'layout_overflow');
  assert.equal(report.layout_regression.current > report.layout_regression.previous, true);
});
