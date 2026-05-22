import test from 'node:test';
import assert from 'node:assert/strict';
import { TopicIndex } from '../topic_index.js';

test('indexes topics and finds related topics by token overlap', () => {
  const index = new TopicIndex();
  index.add('AI coding copilots', 'sha256:one');
  index.add('AI software assistants', 'sha256:two');
  index.add('History of pottery', 'sha256:three');

  const related = index.related('AI copilots for software');
  assert.ok(related.length >= 1);
  assert.equal(related[0].topic.includes('ai'), true);
  assert.equal(index.hashesForTopic('AI coding copilots').length, 1);
});
