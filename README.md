# ResolvePay Rescue

> Autonomous commerce dispute, policy planning, and remedy resolution platform backed by PayPal Orders v2, Google Gemini AI, and an append-only double-entry PostgreSQL subledger.

[![Vitest Tests](https://img.shields.io/badge/tests-30%20passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)]()
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)]()
[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2%20AA-success.svg)]()

---

## Highlights & Capabilities
- **Inspectable Remedy Comparison**: Calculates exact amounts, return requirements, and policy citations for Full Refunds, Partial Refunds, Same-Item Replacements, and Alternative Exchanges.
- **Canonical Hash Binding**: Plan material terms are SHA-256 hashed server-side. Customer acceptance and merchant financial authorization bind to this exact hash.
- **Append-Only Double-Entry Subledger**: Every dollar captured, refunded, or credited is balanced (`PAYPAL_CLEARING`, `SALES_REVENUE`, `SALES_RETURNS`, `EXCHANGE_CREDIT_LIABILITY`). Minor units eliminate float rounding errors.
- **Return & Inspection Gating**: Prevents automated fund disbursement or replacement dispatch until required physical inspection passes.
- **Operator Recovery**: Failed or unknown provider states are reconciled with authoritative provider state without generating duplicate financial requests.
- **Multi-Channel Timeline**: Unifies Web portal, Email (Resend), and WhatsApp (Meta Cloud API) interactions into one audit trail.
- **Zero-Dependency Local Execution**: Out-of-the-box local operation using embedded WebAssembly PostgreSQL 16 (`@electric-sql/pglite`) and deterministic provider fallbacks.

---

## Repository Layout
```text
apps/
  web/                  Next.js 15 UI with same-origin API forwarding
  api/                  NestJS HTTP server, OpenAPI Swagger, and webhooks
  worker/               NestJS scheduled background job runner
packages/
  contracts/            Zod schemas, DTOs, and TypeScript types
  domain/               Money minor units, canonical plan hash, state machines, ledger
  db/                   Drizzle schema, PostgreSQL migrations, synthetic seed fixtures
  integrations/         PayPal sandbox client & mock, Gemini AI & mock, Resend email, Meta WhatsApp
  observability/        JSON logging, sensitive data redaction, metrics
  test-fixtures/        20 labeled AI evaluation cases and synthetic datasets
infra/
  bicep/                Azure Container Apps, PostgreSQL Flexible Server, budget controls
docs/
  decisions.md          Architecture decisions & tradeoffs
  progress.md           Verified milestones & checklist
  setup.md              Account setup & environment configuration
  operations.md         Reliability runbooks & invariants
  cost-estimate.md      Azure $30/mo budget breakdown
  evaluation.md         AI evaluation results across 20 labeled scenarios
  submission.md         Hackathon submission overview
resolve.md              Action items & external account prerequisites
```

---

## Quick Start (Run Locally)

### 1. Prerequisites
- Node.js v20+ (tested on v24)
- `pnpm` (`npm install -g pnpm`)

### 2. Install & Build
```bash
# Install workspace dependencies
pnpm install

# Build all packages and applications
pnpm build
```

### 3. Initialize Database
```bash
# Seeds synthetic tenant, catalog items, policies, and demo order ORD-2026-9041
pnpm db:seed
```

### 4. Run Applications
In separate terminal windows:
```bash
# Terminal 1: Run NestJS API (http://localhost:3001)
pnpm dev:api

# Terminal 2: Run Next.js Web Frontend (http://localhost:3000)
pnpm dev:web

# Terminal 3 (Optional): Run background worker batch
pnpm --filter=@resolvepay/worker start
```

Open your browser to **[http://localhost:3000](http://localhost:3000)**.

---

## End-to-End Demo Journey

1. **Storefront & Purchase**:
   - Visit `http://localhost:3000`.
   - Browse PeakGear mountaineering gear (Backpacks, Trekking Poles, Gore-Tex Jackets).
   - Click **Buy with PayPal** on any item to create an order and capture in sandbox mode.
   - Or click **Test Pre-Seeded Order (ORD-2026-9041)**.
2. **Report Issue & Generate Remedies**:
   - In the customer view, select **Damaged or Defective Item** (e.g. broken backpack zipper).
   - Click **Generate AI Grounded Remedies**.
   - Compare the eligible remedies:
     - Direct Full/Partial Refund ($120.00).
     - Direct Same-Item Replacement (3-day delivery).
     - Alternative Exchanges (e.g. upgrade to 50L Expedition pack or exchange for trekking poles).
3. **Accept Remedy Plan**:
   - Click **Accept this Remedy Plan**.
   - Your acceptance is cryptographically bound to the material terms canonical SHA-256 hash.
4. **Merchant Operations & Inspection**:
   - Switch persona to **Approver** or **Owner** using the top navigation bar.
   - Navigate to **Merchant Operations** (`/merchant`).
   - Open the case and inspect the return: record **Passed (Condition Validated)**.
   - Click **Authorize Financial Plan**.
   - Click **Execute Resolution Saga**.
   - The refund is processed, balanced in the subledger, and fulfillment is dispatched!
5. **Timeline & Audit**:
   - Review the complete chronological audit timeline reflecting all messages, return tracking, approvals, and settlements.

---

## Running the Automated Test Suite
```bash
# Runs Vitest unit tests and all 20 AI evaluation scenarios
pnpm test
```

---

## External Services & Resolve.md
External credentials (Google Gemini API key, PayPal sandbox app credentials, Resend API key, Meta WhatsApp tokens, and Azure subscription) are documented in [`resolve.md`](file:///e:/ResolvePay/resolve.md). The application provides complete local mocks so everything builds, tests, and runs out-of-the-box without waiting for external accounts.

