const CREDIT_LEDGER = new Map();

export function hasCreditAccount(user_id) {
  return CREDIT_LEDGER.has(user_id);
}

export function initializeCredits(user_id, credits = 100) {
  CREDIT_LEDGER.set(user_id, credits);
  return credits;
}

export function getCredits(user_id) {
  return CREDIT_LEDGER.get(user_id) ?? 0;
}

export function consumeCredits(user_id, amount) {
  const current = getCredits(user_id);
  if (current < amount) {
    return { success: false, remaining: current, error: 'insufficient_credits' };
  }
  const updated = current - amount;
  CREDIT_LEDGER.set(user_id, updated);
  return { success: true, remaining: updated };
}

export function addCredits(user_id, amount) {
  const current = getCredits(user_id);
  const updated = current + amount;
  CREDIT_LEDGER.set(user_id, updated);
  return updated;
}
