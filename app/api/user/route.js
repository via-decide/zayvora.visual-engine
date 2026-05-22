import { registerUser, loginUser, authenticate, saveProject } from '../../../auth/auth_provider.js';

export async function POST(req) {
  const body = await req.json();
  if (body.action === 'register') {
    const user = registerUser({ email: body.email, name: body.name });
    return Response.json({ user, deterministic: true });
  }
  if (body.action === 'login') {
    const session = loginUser({ email: body.email });
    return Response.json({ session, deterministic: true });
  }
  if (body.action === 'save_project') {
    const auth = authenticate(body.token);
    if (!auth) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const projects = saveProject(auth.user.user_id, body.project);
    return Response.json({ projects, deterministic: true });
  }
  return Response.json({ error: 'invalid_action' }, { status: 400 });
}
