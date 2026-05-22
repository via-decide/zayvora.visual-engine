export class BriefSectionBuilder {
  buildKeyClaims(mappedClaims = [], maxClaims = 8) {
    return [...mappedClaims]
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .slice(0, maxClaims)
      .map((claim) => ({
        claim_id: claim.claim_id,
        claim: claim.claim,
        source_ids: claim.source_ids || [],
        confidence: claim.confidence,
        verified: claim.verified,
      }));
  }

  buildOpenQuestions(mappedClaims = []) {
    return mappedClaims
      .filter((claim) => !claim.verified)
      .map((claim) => `What evidence would verify: "${claim.claim}"?`)
      .slice(0, 6);
  }

  buildVideoAngles(topic, mappedClaims = [], contradictions = []) {
    const topVerified = mappedClaims.filter((c) => c.verified).slice(0, 2).map((c) => c.claim);
    const angles = [
      `Explainer: what matters most about ${topic} based on verified evidence.`,
      `Evidence-first breakdown: claims, sources, and confidence for ${topic}.`,
    ];
    if (topVerified.length) {
      angles.push(`Narrative angle: start from "${topVerified[0]}" and expand into practical implications.`);
    }
    if (contradictions.length) {
      angles.push(`Debate angle: resolve ${contradictions.length} contradiction(s) in current sources.`);
    }
    return angles;
  }
}
