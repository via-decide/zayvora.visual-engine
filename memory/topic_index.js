function normalizeTopic(topic = '') {
  return String(topic).trim().toLowerCase();
}

function overlap(a, b) {
  const ta = new Set(normalizeTopic(a).split(/\W+/).filter(Boolean));
  const tb = new Set(normalizeTopic(b).split(/\W+/).filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let common = 0;
  for (const t of ta) if (tb.has(t)) common += 1;
  return common / Math.max(ta.size, tb.size);
}

export class TopicIndex {
  constructor() {
    this.topicToHashes = new Map();
  }

  add(topic, contentHash) {
    const key = normalizeTopic(topic);
    if (!key || !contentHash) return;
    if (!this.topicToHashes.has(key)) this.topicToHashes.set(key, new Set());
    this.topicToHashes.get(key).add(contentHash);
  }

  related(topic, minOverlap = 0.4) {
    const out = [];
    for (const key of this.topicToHashes.keys()) {
      const score = overlap(topic, key);
      if (score >= minOverlap) out.push({ topic: key, score });
    }
    return out.sort((a, b) => b.score - a.score);
  }

  hashesForTopic(topic) {
    return [...(this.topicToHashes.get(normalizeTopic(topic)) || new Set())];
  }
}

export { normalizeTopic, overlap };
