import test from 'node:test';
import assert from 'node:assert/strict';
import { registerUser, loginUser, authenticate, saveProject } from '../auth/auth_provider.js';

test('auth provider registers, logs in, authenticates, and stores projects', () => {
  const user = registerUser({ email: 'user@example.com', name: 'User' });
  const session = loginUser({ email: 'user@example.com' });
  const auth = authenticate(session.token);

  assert.equal(user.email, 'user@example.com');
  assert.equal(Boolean(session.token), true);
  assert.equal(auth?.user.user_id, user.user_id);

  const projects = saveProject(user.user_id, { project_id: 'P-001', title: 'Video Project' });
  assert.equal(projects.length, 1);
});
