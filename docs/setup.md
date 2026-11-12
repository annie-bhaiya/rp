# ResolvePay Setup & Account Configuration Guide

This guide details environment variables and external provider configurations for local development and production deployment.

## Quick Start (Zero External Dependencies)
ResolvePay is designed to run locally out-of-the-box using built-in fallbacks:
- **Embedded Database**: Uses `@electric-sql/pglite` (WebAssembly-compiled PostgreSQL 16 engine directly in Node.js) when no external PostgreSQL server is detected on port 5432.
- **AI Advisory**: Uses `DeterministicAiProvider` when `GEMINI_API_KEY` is not provided.
- **Payments**: Uses `MockPayPalAdapter` when `PAYPAL_CLIENT_ID` is empty.
- **Email**: Uses `DevMailboxClient` (logs all sent emails and access links to `/mailbox`) when `RESEND_API_KEY` is empty.

```bash
# 1. Install dependencies
pnpm install

# 2. Build monorepo packages
pnpm build

# 3. Seed database
pnpm db:seed

# 4. Start API server (port 3001)
pnpm dev:api

# 5. Start Web frontend (port 3000)
pnpm dev:web
```

---

## External Provider Setup (When Enabling Live Sandbox Integrations)

### 1. PayPal Sandbox REST App
1. Visit [developer.paypal.com](https://developer.paypal.com) and log in.
2. Under **Apps & Credentials**, select **Sandbox** and click **Create App**.
3. Copy **Client ID** and **Secret Key**.
4. Create a sandbox webhook pointing to `https://<your-domain>/api/v1/webhooks/paypal/default`. Subscribe to:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.REFUNDED`
5. Configure in `.env`:
   ```env
   PAYPAL_MODE=sandbox
   PAYPAL_CLIENT_ID="<client-id>"
   PAYPAL_CLIENT_SECRET="<secret-key>"
   PAYPAL_WEBHOOK_ID="<webhook-id>"
   ```

### 2. Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create an API Key.
3. Configure in `.env`:
   ```env
   GEMINI_API_KEY="<api-key>"
   GEMINI_MODEL="gemini-2.5-flash"
   AI_PAID_FALLBACK=false
   AI_DAILY_REQUEST_LIMIT=100
   ```

### 3. Resend Transactional Email
1. Create an account at [resend.com](https://resend.com).
2. Verify your sending domain (e.g. `divyansh.live`) by adding the SPF, DKIM, and DMARC TXT records provided by Resend.
3. Generate an API Key.
4. Configure in `.env`:
   ```env
   EMAIL_PROVIDER=resend
   RESEND_API_KEY="re_..."
   EMAIL_FROM=resolvepay@divyansh.live
   EMAIL_DOMAIN=divyansh.live
   ```

