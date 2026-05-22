import test from 'node:test';
import assert from 'node:assert/strict';
import { ResearchOrchestrator } from '../research_orchestrator.js';

test('orchestrates all research stages into verified handoff', async () => {
  const orchestrator = new ResearchOrchestrator({
    sourceDiscoveryEngine: {
      async discover() {
        return {
          toJSON() {
            return {
              hash: 'sha256:manifest',
              sources: [{ source_id: 'SRC-001', url: 'https://example.org/article', sourceType: 'articles' }],
            };
          },
        };
      },
    },
    webIngestor: {
      async ingestBatch() {
        return {
          toJSON() {
            return {
              resources: [{ source_id: 'SRC-001', url: 'https://example.org/article', text: 'AI copilots can reduce repetitive coding effort by automating boilerplate tasks.' }],
            };
          },
        };
      },
    },
  });

  const out = await orchestrator.run('AI copilots for software teams', { verification: { minSources: 1, minWordsPerSource: 5 } });
  assert.equal(out.verification_report.ready_for_video, true);
  assert.ok(out.video_research_package.package_hash.startsWith('sha256:'));
  assert.equal(out.visual_engine_handoff.validation.compatible, true);
});
