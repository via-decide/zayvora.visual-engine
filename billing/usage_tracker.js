import { sha256Hash } from '../visual/visual_hash.js';

const USAGE = new Map();

export function trackUsage({ user_id, request_id, render_type = 'video', credits_used = 1 }) {
  const usage = {
    usage_id: `usage_${sha256Hash({ user_id, request_id, render_type }).slice(7, 19)}`,
    user_id,
    request_id,
    render_type,
    credits_used,
    created_at: '1970-01-01T00:00:00.000Z',
  };
  if (!USAGE.has(user_id)) USAGE.set(user_id, []);
  USAGE.get(user_id).push(usage);
  return usage;
}

export function getUsage(user_id) {
  return USAGE.get(user_id) ?? [];
}
