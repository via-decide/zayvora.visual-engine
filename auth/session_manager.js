import { sha256Hash } from '../visual/visual_hash.js';

const SESSIONS = new Map();

export function createSession(user) {
  const token = `sess_${sha256Hash({ user_id: user.user_id, email: user.email, t: user.created_at ?? '0' }).slice(7, 27)}`;
  const session = {
    token,
    user_id: user.user_id,
    created_at: new Date(0).toISOString(),
    deterministic: true,
  };
  SESSIONS.set(token, session);
  return session;
}

export function getSession(token) {
  return SESSIONS.get(token) ?? null;
}

export function destroySession(token) {
  return SESSIONS.delete(token);
}
