import { sha256Hash } from '../visual/visual_hash.js';
import { createSession, getSession } from './session_manager.js';

const USERS = new Map();

export function registerUser({ email, name }) {
  const user_id = `usr_${sha256Hash({ email }).slice(7, 15)}`;
  const user = { user_id, email, name: name ?? email.split('@')[0], created_at: '1970-01-01T00:00:00.000Z', projects: [] };
  USERS.set(user_id, user);
  return user;
}

export function loginUser({ email }) {
  const user = [...USERS.values()].find((u) => u.email === email);
  if (!user) throw new Error('User not found');
  return createSession(user);
}

export function authenticate(token) {
  const session = getSession(token);
  if (!session) return null;
  const user = USERS.get(session.user_id) ?? null;
  return user ? { user, session } : null;
}

export function saveProject(user_id, project) {
  const user = USERS.get(user_id);
  if (!user) throw new Error('User not found');
  user.projects.push(project);
  USERS.set(user_id, user);
  return user.projects;
}
