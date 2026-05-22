function pickMeta(html, names) {
  const normalized = names.map((n) => n.toLowerCase());
  const metaRegex = /<meta\s+[^>]*>/gi;
  const metas = String(html).match(metaRegex) || [];
  for (const tag of metas) {
    const nameMatch = tag.match(/(?:name|property)=['\"]([^'\"]+)['\"]/i);
    const contentMatch = tag.match(/content=['\"]([^'\"]+)['\"]/i);
    if (!nameMatch || !contentMatch) continue;
    if (normalized.includes(nameMatch[1].toLowerCase())) return contentMatch[1].trim();
  }
  return '';
}

export function extractMetadataFromHtml(html, url) {
  const title =
    pickMeta(html, ['og:title', 'twitter:title']) ||
    (String(html).match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? '');

  const author = pickMeta(html, ['author', 'article:author', 'og:author']);
  const publishedAt = pickMeta(html, ['article:published_time', 'pubdate', 'date']);

  let domain = '';
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = '';
  }

  return { title, author, publishedAt, domain };
}
