import test from 'node:test';
import assert from 'node:assert/strict';
import { TimelineModel } from '../timeline_model.js';

test('timeline continuity has no frame gaps', () => {
  const timeline = new TimelineModel();
  timeline.addSceneSegment('SCENE-001', 0, 120);
  timeline.addSceneSegment('SCENE-002', 120, 180);
  assert.equal(timeline.validateFrameContinuity(), true);
  const ranges = timeline.calculateFrameRanges();
  assert.equal(ranges[0].end_frame + 1, ranges[1].start_frame);
});
