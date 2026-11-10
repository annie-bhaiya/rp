# Operational Runbooks & Reliability Architecture

ResolvePay enforces strict financial invariants, saga idempotency, and operator recovery procedures.

## 1. Subledger Invariants
1. **Double-Entry Balance**: Every financial mutation is committed with balanced debit and credit entries (`sum(debits) === sum(credits)`). Attempting an unbalanced entry throws `LedgerImbalanceError` and aborts the database transaction.
2. **Ceiling Verification**: Cumulative refunds plus locally reserved in-flight amounts cannot exceed the authoritative PayPal capture amount.
3. **Canonical Hash Binding**: Plan material terms (items, quantities, refund amounts, extra payments, return conditions, and citations) are hashed using SHA-256. Acceptance and approval bind to this hash. Any mid-flight change invalidates prior acceptance.

## 2. Background Worker & Job Execution
- **Durable Step Execution**: Background steps are claimed with `SELECT ... FOR UPDATE SKIP LOCKED` inside a short transaction with a fencing token and lease owner.
- **No-Traffic Drainage**: Even if no browser traffic arrives, the Container Apps Job runs periodically to drain the queue and reconcile pending operations.
- **Idempotency Keys**: Retried operations preserve the exact provider request ID and payload.

## 3. Operator Runbooks

### Runbook 1: Resolving UNKNOWN PayPal State
- **Symptom**: Step state marked `UNKNOWN` after network timeout.
- **Action**: Do NOT click a generic payment retry button (which risks duplicate charge/refund). Navigate to **Merchant Operations > Recovery Queue**. Click **Reconcile Authoritative State**. The system queries PayPal GET `/v2/payments/refunds/{id}` or checks verified webhooks to settle or escalate.

### Runbook 2: Inspection Gate Failure
- **Symptom**: Customer returned incorrect or damaged item not matching warranty policy.
- **Action**: Merchant records `INSPECTION_FAILED` with inspector notes in the portal. Automated execution is blocked. Case enters `MANUAL_REVIEW` where customer is notified without derogatory accusations.

### Runbook 3: Free-Tier AI Quota Limit
- **Symptom**: 429 Rate Limit from Gemini API.
- **Action**: The system catches the 429, logs the event, and surfaces a deterministic fallback plan draft for merchant review. Paid AI fallback is disabled by default (`AI_PAID_FALLBACK=false`).

