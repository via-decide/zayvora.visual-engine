# SaaS Architecture: Auth, Usage, and Monetization

This layer turns the video system into a SaaS-ready product with authentication, usage metering, and credit-based billing.

## Modules

- `auth/auth_provider.js` — user registration/login/authentication and project storage.
- `auth/session_manager.js` — deterministic session token issuance and lookup.
- `billing/usage_tracker.js` — usage events per render/job.
- `billing/credit_system.js` — credit initialization, consumption, and balance management.
- `billing/billing_engine.js` — pricing rules, charge enforcement, and summaries.

## API endpoints

- `POST /api/user` — register/login/save project.
- `POST /api/usage` — fetch usage for authenticated user.
- `POST /api/billing` — charge renders and fetch billing summary.

## Monetization rule

Every render consumes credits and is tracked as usage.

## Determinism

- Session tokens are deterministic from user identity seed.
- Charges are based on fixed render-type costs.
- Usage events and billing summaries are reproducible from input sequence.
