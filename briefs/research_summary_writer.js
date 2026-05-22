function topClaims(claims = [], count = 3) {
  return [...claims]
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, count);
}

export class ResearchSummaryWriter {
  write({ topic, claims = [], contradictions = [], openQuestions = [] }) {
    const verifiedCount = claims.filter((c) => c.verified).length;
    const total = claims.length;
    const strongest = topClaims(claims)
      .map((c) => `- ${c.claim}`)
      .join('\n');

    return [
      `Topic: ${topic}`,
      `Verified claims: ${verifiedCount}/${total}.`,
      `Contradictions detected: ${contradictions.length}.`,
      strongest ? 'Strongest supported claims:\n' + strongest : 'No strongly supported claims available yet.',
      openQuestions.length ? `Open questions: ${openQuestions.length}.` : 'No open questions identified.',
    ].join('\n');
  }
}
