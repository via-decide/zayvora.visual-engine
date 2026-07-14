import test from 'node:test';
import assert from 'node:assert/strict';
import { runCanonicalVisualPipeline, createNarrative, createSlideSpecification, renderSlides } from '../visual_pipeline.js';

test('canonical pipeline produces distinct complete artifacts', () => {
  const prompts = ['Why APIs fail at scale', 'How a heat exchanger transfers energy', 'Why local-first software changes ownership'];
  const runs = prompts.map((prompt) => runCanonicalVisualPipeline(prompt));
  for (const run of runs) {
    assert.equal(run.status, 'success');
    assert.ok(run.intent.communication_objective);
    assert.equal(run.narrative.beats.length, 7);
    assert.equal(run.slide_specification.slides.length, 7);
    assert.equal(run.artifact.complete, true);
    assert.equal(run.artifact.slides.length, 7);
  }
  assert.notEqual(runs[0].artifact.slides[1].title, runs[1].artifact.slides[1].title);
  assert.notEqual(runs[1].artifact.slides[1].title, runs[2].artifact.slides[1].title);
});

test('missing and invalid stages fail instead of creating demo output', () => {
  assert.throws(() => runCanonicalVisualPipeline(''), /MISSING_PROMPT/);
  assert.throws(() => createNarrative({}), /MISSING_INTENT_OUTPUT/);
  assert.throws(() => createSlideSpecification({ beats: [] }), /EMPTY_NARRATIVE/);
  assert.throws(() => renderSlides({ slides: [{ title: 'invalid' }] }), /INVALID_SLIDE_SPECIFICATION/);
});
