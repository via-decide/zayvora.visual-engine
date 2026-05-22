import { authenticate } from '../../../auth/auth_provider.js';
import { getUsage } from '../../../billing/usage_tracker.js';

export async function POST(req) {
  const body = await req.json();
  const auth = authenticate(body.token);
  if (!auth) return Response.json({ error: 'unauthorized' }, { status: 401 });
  return Response.json({ user_id: auth.user.user_id, usage: getUsage(auth.user.user_id), deterministic: true });
}
