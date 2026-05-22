import test from 'node:test';
import assert from 'node:assert/strict';
import { StoryboardPayloadBuilder } from '../storyboard_payload_builder.js';

test('builds storyboard payload preserving citations, source cards, and claim-evidence mapping', () => {
  const builder = new StoryboardPayloadBuilder();
  const payload = builder.build({
    topic: 'AI coding copilots',
    video_title_options: ['Title A'],
    hook_options: ['Hook A'],
    talking_points: [
      { section: 'Section 1', claim_id: 'CLAIM-001', talking_point: 'Point 1', confidence: 0.9, verified: true, source_ids: ['SRC-1'] },
    ],
    section_evidence: [
      { claim_id: 'CLAIM-001', evidence: { source_id: 'SRC-1', excerpts: ['evidence'] } },
    ],
    citations: [{ claim_id: 'CLAIM-001', source_id: 'SRC-1' }],
    source_cards: [{ source_id: 'SRC-1', url: 'https://example.org' }],
    source_manifest_hash: 'sha256:manifest',
    package_hash: 'sha256:pkg',
  });

  assert.equal(payload.storyboard_sections.length, 1);
  assert.equal(payload.storyboard_sections[0].claim_id, 'CLAIM-001');
  assert.equal(payload.storyboard_sections[0].evidence.source_id, 'SRC-1');
  assert.equal(payload.citations.length, 1);
  assert.equal(payload.source_cards.length, 1);
});
