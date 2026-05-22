export class VideoAngleGenerator {
  generate(topic, keyClaims = [], contradictions = []) {
    const base = [
      `${topic}: what the strongest evidence actually says`,
      `${topic}: evidence-first guide for viewers`,
      `${topic}: myth vs reality from cited sources`,
    ];
    if (keyClaims.length) {
      base.push(`${topic}: start from "${keyClaims[0].claim}"`);
    }
    if (contradictions.length) {
      base.push(`${topic}: resolving ${contradictions.length} source contradiction(s)`);
    }
    return [...new Set(base)].slice(0, 5);
  }

  generateHooks(topic, keyClaims = []) {
    const claim = keyClaims[0]?.claim || `what most people miss about ${topic}`;
    return [
      `What if the truth about ${topic} is hiding in plain sight?`,
      `Before you trust the hype on ${topic}, look at this evidence.`,
      `The data says something surprising: ${claim}`,
    ];
  }
}
