const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class FreshnessScorer {
  score(publishedAt, now = new Date()) {
    if (!publishedAt) return 35;
    const published = new Date(publishedAt);
    if (Number.isNaN(published.getTime())) return 20;

    const ageDays = Math.max(0, (now.getTime() - published.getTime()) / MS_PER_DAY);
    if (ageDays <= 7) return 100;
    if (ageDays <= 30) return 88;
    if (ageDays <= 90) return 74;
    if (ageDays <= 180) return 62;
    if (ageDays <= 365) return 48;
    if (ageDays <= 730) return 34;
    return 20;
  }
}
