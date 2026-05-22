import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceCoverageChecker } from '../source_coverage_checker.js';

test('detects weak source coverage and thin sources', () => {
  const checker = new SourceCoverageChecker();
  const weak = checker.check(
    [
      { source_id: 'SRC-001', text: 'too short' },
    ],
    { minSources: 2, minWordsPerSource: 5 },
  );

  assert.equal(weak.length, 2);
  assert.equal(weak[0].reason, 'insufficient_source_count');
  assert.equal(weak[1].reason, 'low_content_density');
});
