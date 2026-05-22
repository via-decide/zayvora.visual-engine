import test from 'node:test';
import assert from 'node:assert/strict';
import { NotebookResearchPipeline } from '../notebook_research_pipeline.js';

test('runs full notebooklm-style verified research workflow', async () => {
  const pipeline = new NotebookResearchPipeline({
    orchestrator: {
      async run() {
        return {
          source_discovery: { hash: 'sha256:disc' },
          ingestion_manifest: { hash: 'sha256:ing' },
          evidence: { claims: [] },
          source_quality: [],
          contradictions: [],
          research_brief: { brief_hash: 'sha256:brief' },
          video_research_package: { package_hash: 'sha256:pkg' },
          verification_report: { ready_for_video: true },
          visual_engine_handoff: { validation: { compatible: true } },
        };
      },
    },
  });

  const result = await pipeline.run('AI copilots topic');
  assert.equal(result.verified, true);
  assert.equal(result.ready_for_video, true);
  assert.ok(result.pipeline_summary.pipeline_hash.startsWith('sha256:'));
  assert.ok(result.trace.event_count >= 3);
});
