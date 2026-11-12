# Technical Decisions and Tradeoffs

## Architecture & Frameworks
- **Repository Strategy**: TypeScript monorepo managed with `pnpm` workspaces.
- **Node.js Target**: Node LTS v24+ (running on Node v24.18.0).
- **PostgreSQL**: PostgreSQL 16 standard. Database abstraction via `drizzle-orm` with schema migrations in `packages/db`. Local zero-install fallback via `@electric-sql/pglite` embedded engine when external port 5432 is absent.
- **API**: NestJS (v10) with Express HTTP adapter and Swagger/OpenAPI generation.
- **Worker**: NestJS standalone application context running scheduled polling and bounded batch job execution with DB row-level locking (`SELECT ... FOR UPDATE SKIP LOCKED`).
- **Frontend**: Next.js 15 (App Router) with React 19, Tailwind CSS, TanStack Query, and Lucide icons.
- **AI Integration**: Official `@google/genai` SDK using Gemini models (primary: `gemini-2.5-flash`), featuring Zod-structured output schemas, deterministic extraction and proposal generation, plus offline deterministic fallback provider when API key is not supplied.
- **Payments**: PayPal Orders v2 REST API (Create Order, Show Order, Capture Order, Captures Refund) with request idempotency keys and cryptographic webhook verification. Mock payment adapter provided for offline sandbox demo testing.
- **Email**: Resend transactional email adapter with domain validation against `divyansh.live` + Dev mailbox logger.
- **Multi-Tenancy**: Tenant-isolated tables with `tenant_id` foreign keys and PostgreSQL Row-Level Security (RLS) enforcement.
- **Financial Invariants**: Integer minor-unit math (`bigint` or string-serialized minor units, e.g. `$120.00` = `12000` cents). Append-only double-entry journal subledger balancing debits and credits.

