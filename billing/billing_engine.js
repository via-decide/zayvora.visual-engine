import { consumeCredits, getCredits, hasCreditAccount, initializeCredits } from './credit_system.js';
import { trackUsage, getUsage } from './usage_tracker.js';

const COSTS = { video: 5, batch_job: 3, preview: 1 };

export function ensureAccount(user_id) {
  if (!hasCreditAccount(user_id)) initializeCredits(user_id, 100);
}

export function chargeForRender({ user_id, request_id, render_type = 'video' }) {
  ensureAccount(user_id);
  const credits_needed = COSTS[render_type] ?? COSTS.video;
  const charged = consumeCredits(user_id, credits_needed);
  if (!charged.success) {
    return { success: false, reason: charged.error, remaining_credits: charged.remaining };
  }
  const usage = trackUsage({ user_id, request_id, render_type, credits_used: credits_needed });
  return {
    success: true,
    credits_used: credits_needed,
    remaining_credits: charged.remaining,
    usage,
  };
}

export function getBillingSummary(user_id) {
  return {
    user_id,
    credits: getCredits(user_id),
    usage: getUsage(user_id),
  };
}
