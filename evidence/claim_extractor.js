function splitSentences(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function isClaimSentence(sentence) {
  if (!sentence) return false;
  if (sentence.length < 25) return false;
  return /(is|are|was|were|has|have|can|will|shows|indicates|demonstrates|according to)/i.test(sentence);
}

export class ClaimExtractor {
  extractClaims(resources = []) {
    const claims = [];
    let index = 1;

    for (const resource of resources) {
      const sentences = splitSentences(resource.text);
      for (const sentence of sentences) {
        if (!isClaimSentence(sentence)) continue;
        claims.push({
          claim_id: `CLAIM-${String(index).padStart(3, '0')}`,
          claim: sentence,
          source_hint: resource.source_id,
        });
        index += 1;
      }
    }

    return claims;
  }
}

export { splitSentences, isClaimSentence };
