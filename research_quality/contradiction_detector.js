function normalize(sentence) {
  return String(sentence || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenSet(text) {
  return new Set(normalize(text).split(' ').filter((t) => t.length > 2));
}

function overlapRatio(a, b) {
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const t of a) if (b.has(t)) overlap += 1;
  return overlap / Math.max(a.size, b.size);
}

function hasNegation(text) {
  return /\b(no|not|never|none|without|cannot|can't|isn't|aren't|doesn't|won't)\b/i.test(text);
}

export class ContradictionDetector {
  detect(claimRecords = []) {
    const contradictions = [];
    for (let i = 0; i < claimRecords.length; i += 1) {
      for (let j = i + 1; j < claimRecords.length; j += 1) {
        const a = claimRecords[i];
        const b = claimRecords[j];
        const ra = tokenSet(a.claim);
        const rb = tokenSet(b.claim);
        const overlap = overlapRatio(ra, rb);
        if (overlap < 0.45) continue;

        const negA = hasNegation(a.claim);
        const negB = hasNegation(b.claim);
        if (negA === negB) continue;

        contradictions.push({
          claim_a: a.claim_id,
          claim_b: b.claim_id,
          overlap: Number(overlap.toFixed(2)),
          reason: 'semantic_overlap_with_opposite_polarity',
        });
      }
    }
    return contradictions;
  }
}
