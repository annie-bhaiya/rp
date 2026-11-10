# ResolvePay Rescue — Hackathon Submission

## Project Overview
ResolvePay Rescue turns failed e-commerce purchases into verified, trustworthy remedies. When an order arrives damaged, defective, or missing, ResolvePay pairs Google Gemini structured reasoning with deterministic policy evaluation, mathematical double-entry accounting guarantees, and idempotent PayPal checkout and refund sagas.

## Key Features & Highlights
- **Grounded Remedy Generation**: Deterministically models and compares full refunds, partial refunds, same-item replacements, and cheaper/upgrade exchanges with exact dollar-and-cent precision.
- **Canonical Material Terms Hashing**: SHA-256 hash binds customer acceptance and merchant approval to exact items, refund amounts, extra charges, and return conditions. Any mid-flight modification invalidates prior consent.
- **Append-Only Double-Entry Subledger**: Every capture, refund, and credit consumption is balanced across ledger accounts (`PAYPAL_CLEARING`, `SALES_REVENUE`, `SALES_RETURNS`, `EXCHANGE_CREDIT_LIABILITY`). Integer minor units eliminate floating-point rounding errors.
- **Multi-Channel Timeline**: Ingests complaints and status updates across Web, Email (Resend), and Meta WhatsApp Cloud API into a single unified audit timeline.
- **Physical Return & Inspection Gates**: Policy rules enforce return and merchant condition inspection before funds are disbursed or replacement inventory is dispatched.
- **Operator Recovery Queue**: Stale or unknown operations are reconciled with authoritative provider state without creating duplicate payment keys.
- **Impeccable Craft Design**: Modern, responsive, accessible interface built following WCAG 2.2 AA standards (visible focus, tabular numerals, 4.5:1+ contrast).

## Architecture
- **Monorepo**: pnpm workspaces (`apps/web`, `apps/api`, `apps/worker`, `packages/contracts`, `packages/domain`, `packages/db`, `packages/integrations`, `packages/observability`, `packages/test-fixtures`).
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, TanStack Query.
- **API**: NestJS with Express, OpenAPI Swagger documentation.
- **Worker**: Standalone NestJS application context running scheduled bounded batch jobs.
- **Database**: PostgreSQL 16 managed via Drizzle ORM; zero-install embedded PGlite WebAssembly engine for offline local execution.
- **Cloud Infrastructure**: Azure Container Apps (scale-to-zero), Azure Database for PostgreSQL Flexible Server, Azure Blob Storage (within USD 30/mo budget).
