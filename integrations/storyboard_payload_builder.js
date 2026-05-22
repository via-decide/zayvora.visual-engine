export class StoryboardPayloadBuilder {
  build(verifiedPackage = {}) {
    const topic = verifiedPackage.topic || 'Untitled Topic';
    const talkingPoints = verifiedPackage.talking_points || [];
    const sectionEvidence = verifiedPackage.section_evidence || [];
    const evidenceByClaim = new Map(
      sectionEvidence.filter((row) => row?.claim_id).map((row) => [row.claim_id, row.evidence]),
    );

    const storyboardSections = talkingPoints.map((point, index) => ({
      section_id: `SB-${String(index + 1).padStart(3, '0')}`,
      title: point.section || `Section ${index + 1}`,
      narration_goal: point.talking_point || '',
      claim_id: point.claim_id || null,
      confidence: point.confidence ?? 0,
      verified: point.verified !== false,
      source_ids: point.source_ids || [],
      evidence: point.claim_id ? evidenceByClaim.get(point.claim_id) || null : null,
    }));

    return {
      topic,
      video_title_options: verifiedPackage.video_title_options || [],
      hook_options: verifiedPackage.hook_options || [],
      storyboard_sections: storyboardSections,
      citations: verifiedPackage.citations || [],
      source_cards: verifiedPackage.source_cards || [],
      source_manifest_hash: verifiedPackage.source_manifest_hash || '',
      package_hash: verifiedPackage.package_hash || '',
    };
  }
}
