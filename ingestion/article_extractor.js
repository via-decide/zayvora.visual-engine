import { htmlToText } from './html_cleaner.js';

export function extractArticleText(html = '') {
  const articleMatch = String(html).match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  const candidate = articleMatch ? articleMatch[1] : html;
  return htmlToText(candidate);
}
