import test from 'node:test';
import assert from 'node:assert/strict';
import { registerUser } from '../auth/auth_provider.js';
import { initializeCredits, getCredits } from '../billing/credit_system.js';
import { chargeForRender, getBillingSummary } from '../billing/billing_engine.js';

test('billing engine tracks usage and consumes credits per render and enforces limits', () => {
  const user = registerUser({ email: 'billing@example.com', name: 'Billing' });
  initializeCredits(user.user_id, 10);

  const first = chargeForRender({ user_id: user.user_id, request_id: 'REQ-1', render_type: 'video' });
  assert.equal(first.success, true);
  assert.equal(first.credits_used, 5);
  assert.equal(getCredits(user.user_id), 5);

  const second = chargeForRender({ user_id: user.user_id, request_id: 'REQ-2', render_type: 'video' });
  assert.equal(second.success, true);
  assert.equal(getCredits(user.user_id), 0);

  const third = chargeForRender({ user_id: user.user_id, request_id: 'REQ-3', render_type: 'video' });
  assert.equal(third.success, false);
  assert.equal(third.reason, 'insufficient_credits');

  const summary = getBillingSummary(user.user_id);
  assert.equal(summary.usage.length, 2);
});
