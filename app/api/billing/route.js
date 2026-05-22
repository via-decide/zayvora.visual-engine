import { authenticate } from '../../../auth/auth_provider.js';
import { chargeForRender, getBillingSummary } from '../../../billing/billing_engine.js';

export async function POST(req) {
  const body = await req.json();
  const auth = authenticate(body.token);
  if (!auth) return Response.json({ error: 'unauthorized' }, { status: 401 });

  if (body.action === 'charge') {
    const result = chargeForRender({ user_id: auth.user.user_id, request_id: body.request_id, render_type: body.render_type ?? 'video' });
    return Response.json({ ...result, deterministic: true });
  }

  if (body.action === 'summary') {
    return Response.json({ summary: getBillingSummary(auth.user.user_id), deterministic: true });
  }

  return Response.json({ error: 'invalid_action' }, { status: 400 });
}
