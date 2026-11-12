# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
TypeScript monorepo with pnpm workspaces; Next.js 15 (App Router) frontend with Tailwind CSS and TanStack Query; NestJS API; NestJS background worker; PostgreSQL 16 with Drizzle ORM; Zod contracts.

## Users
1. **Consumers / Buyers**: Shoppers dealing with damaged, missing, wrong, or unwanted purchases seeking fast, fair, transparent resolution (refund, replacement, or exchange) without repetitive support runarounds or vague promises.
2. **Merchants & Store Owners**: E-commerce businesses needing policy-governed financial controls, automated complaint triaging, fraud protection, inspection gating, and rigorous accounting integrity.
3. **Support Agents / Approvers / Inspectors**: Ops staff evaluating evidence, authorizing documented financial exceptions, and recording physical return inspections.

## Product Purpose
ResolvePay Rescue turns failed e-commerce purchases into verified, trustworthy remedies. It ingests complaints across Web, Email, deterministically models policy-grounded remedy options (full/partial refunds, replacements, cheaper/more expensive exchanges), obtains cryptographic/hash-bound customer and merchant acceptance, executes payment and logistics sagas via PayPal and fulfillment systems, and reconciles every dollar in an append-only double-entry subledger.

## Positioning
Unlike conversational AI bots that hallucinate promises or make unverified refunds, and unlike rigid one-size-fits-all return portals, ResolvePay pairs advisory AI issue extraction with deterministic, inspectable resolution plans, mathematical double-entry accounting guarantees, strict state-machine recovery sagas, and multi-channel synchronization.

## Operating Context
Operates in high-stakes financial e-commerce environments. Works across desktop and mobile browsers, transactional email threads messaging. Connects to PayPal sandbox/live REST APIs, managed PostgreSQL on Azure, private Azure Blob storage for evidence, and Google Gemini for structured reasoning.

## Capabilities and Constraints
- Immutable versioned policy clauses and deterministic option enumeration.
- AI advisory issue extraction & explanation with strictly validated Zod schemas.
- Hash-bound customer acceptance and merchant authorization before any financial side-effect.
- Double-entry subledger invariants (balanced debits/credits, no float precision errors).
- Idempotent saga execution with durable step recovery for PayPal captures and refunds.
- Multi-channel timeline linking Web, Email.
- Simulated and real fulfillment/inspection workflows.

## Brand Commitments
Name: ResolvePay Rescue
Voice: Authoritative, calm, transparent, precise, reassuring.
No hype, no vague promises, exact numbers in dollars and cents.

## Evidence on Hand
Synthetic catalog with realistic products (apparel, electronics, gear), baseline return policies, simulated shipping adapter, deterministic evaluation suites with 20 edge-case test fixtures.

## Product Principles
1. **Never compromise financial invariants** — AI advises, deterministic code authorizes and books.
2. **What you see is what executes** — plans are cryptographically bound to material terms.
3. **Every external interaction is durable and resumable** — never drop transactions on failure.
4. **Total transparency** — customers and merchants see citations, breakdowns, and exact tracking.

## Accessibility & Inclusion
Target WCAG 2.2 AA compliance: visible keyboard focus, 4.5:1 text contrast, semantic ARIA roles, screen-reader friendly status timelines, zero reliance on color alone for states.
