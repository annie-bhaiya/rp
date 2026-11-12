# ResolvePay Rescue

> Autonomous commerce dispute, policy planning, and remedy resolution platform backed by PayPal Orders v2, Google Gemini AI, and an append-only double-entry PostgreSQL subledger.

[![Vitest Tests](https://img.shields.io/badge/tests-suite-brightgreen.svg)]()
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
- **Web and Email Journey**: Customers use the web portal and email access links, with messages recorded in the case timeline.
- **AI Resolution Brief**: Gemini extracts issues and stated remedy preferences from the actual complaint, explains eligible remedies, and suggests an option for customer and merchant review. Provider failures use a clearly labeled deterministic fallback.
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
  integrations/         PayPal sandbox client & mock, Gemini AI & mock, Resend email
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

1. Open a purchased or explicitly simulated seeded order.
2. Describe the issue and click **Find my resolution**. The app opens the case, analyzes the narrative, and prepares remedies automatically.
3. Review the shared resolution brief, source labels, missing facts, exact prices and policy citations. Choose a no-extra-cost remedy.
4. In merchant operations, review evidence, record any required inspection, and click **Approve & resolve**. Outstanding return checks block execution.
5. Review the resolution timeline and ledger. Use an actual PayPal sandbox purchase to demonstrate a real provider refund.

See [the demo guide](docs/hackathon-demo.md) for the presentation and current limitations.

---

## APIMatic Developer Hub, SDKs & AI Context Plugin

ResolvePay Rescue integrates with **[APIMatic](https://www.apimatic.io/)** to provide typed client libraries, an interactive 54-page API documentation portal, and AI coding assistant skills:

- **Official SDKs**:
  - [TypeScript / Node.js SDK](apimatic/sdks/typescript/README.md) (`apimatic/sdks/typescript`)
  - [Python SDK](apimatic/sdks/python/README.md) (`apimatic/sdks/python`)
  - [C# / .NET SDK](apimatic/sdks/csharp/README.md) (`apimatic/sdks/csharp`)
- **Interactive Developer Documentation Portal**: 54 static pages with live API playground and `llms.txt` (`apimatic/portal/index.html`).
- **AI Context Plugin**: Skills for Claude Code, Cursor, Copilot, and Antigravity (`apimatic/plugin`).
- **Developer Guide**: Detailed usage, continuous sync, and local preview instructions in [`docs/apimatic.md`](docs/apimatic.md).

```bash
# Validate OpenAPI with APIMatic
pnpm apimatic:validate

# Regenerate all SDKs, Portal, and AI Plugin
pnpm apimatic:all
```

---

## Running the Automated Test Suite
```bash
# Runs Vitest unit tests and all 20 AI evaluation scenarios
pnpm test
```

---

## External Services & Resolve.md
External credentials (Google Gemini API key, PayPal sandbox app credentials, Resend API key, and Azure subscription) are documented in [`resolve.md`](resolve.md). The application provides complete local mocks so everything builds, tests, and runs out-of-the-box without waiting for external accounts.

