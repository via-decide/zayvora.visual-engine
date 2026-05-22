import { sha256Hash } from '../visual/visual_hash.js';

export function generateYouTubeTitle(context = {}) {
  const base = context.title ?? context.prompt ?? 'Untitled Video';
  return base.length > 100 ? `${base.slice(0, 97)}...` : base;
}

export function generateYouTubeDescription(context = {}) {
  const summary = context.summary ?? 'Deterministic visual generation export.';
  const bullets = (context.highlights ?? []).map((item) => `- ${item}`).join('\n');
  const citations = (context.citations ?? []).map((c) => `Source: ${c.title ?? c}`).join('\n');
  return `${summary}\n\n${bullets}\n\n${citations}`.trim();
}

export function generateMetadataPackage(context = {}) {
  const metadata = {
    title: generateYouTubeTitle(context),
    description: generateYouTubeDescription(context),
    tags: context.tags ?? ['zayvora', 'visual-engine', 'deterministic-video'],
    category: context.category ?? 'Education',
    deterministic: true,
  };
  metadata.metadata_hash = sha256Hash(metadata);
  return metadata;
}
