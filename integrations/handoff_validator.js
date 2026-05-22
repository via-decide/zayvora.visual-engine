export class HandoffValidator {
  validate({ packageData, verificationReport, storyboardPayload, contract }) {
    const issues = [];

    if (!verificationReport?.ready_for_video) {
      issues.push('verification_not_ready');
    }

    if (!Array.isArray(storyboardPayload?.storyboard_sections) || storyboardPayload.storyboard_sections.length === 0) {
      issues.push('missing_storyboard_sections');
    }

    const pkgCitationCount = (packageData?.citations || []).length;
    const sbCitationCount = (storyboardPayload?.citations || []).length;
    if (pkgCitationCount !== sbCitationCount) {
      issues.push('citation_count_mismatch');
    }

    const pkgSourceCards = new Set((packageData?.source_cards || []).map((c) => c.source_id));
    const sbSourceCards = new Set((storyboardPayload?.source_cards || []).map((c) => c.source_id));
    for (const sourceId of pkgSourceCards) {
      if (!sbSourceCards.has(sourceId)) issues.push(`missing_source_card:${sourceId}`);
    }

    if (!contract?.contract_type || !contract?.contract_hash) {
      issues.push('invalid_contract_export');
    }

    return {
      compatible: issues.length === 0,
      issues,
    };
  }
}
