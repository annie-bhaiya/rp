# ResolvePay: a focused PayPal + AI demonstration

## Product story

For small merchants, a failed purchase creates repetitive support work and uncertainty about refunds. ResolvePay turns the customer's own words into a reviewable remedy, connects approval to PayPal execution, and records the outcome.

## Three-minute walkthrough

1. Purchase through PayPal sandbox, or explicitly label the seeded order as a simulation.
2. Open the order and describe the actual issue. Submit once: the case opens and remedies are prepared automatically. Show that a missing-item complaint differs from a damaged-item complaint.
3. Show the resolution brief: extraction source, summary, missing facts, recommendation, and tradeoffs. Show exact amounts and policy citations separately from AI advice.
4. Choose a no-extra-cost remedy. The customer accepts the displayed terms.
5. Open merchant operations. Review the same brief and evidence. For damage, record inspection only after a physical return has actually been inspected; use a stated simulation in the demo.
6. Click **Approve & resolve**. If a return gate is outstanding, approval is saved and execution waits. Once gates pass, execution records the refund and fulfillment result.
7. Show the case timeline and ledger. For a real sandbox refund, also show the provider refund identifier in PayPal. Do not present seeded payment IDs as real API results.

## Alignment with judging

Official criteria: https://paypalaihackathon.devpost.com/rules (checked November 11, 2026).

| Criterion | Evidence to demonstrate |
|---|---|
| Technological implementation | Actual complaint to validated Gemini extraction; deterministic amounts; sandbox refund |
| Design | One complaint form; automatic remedy preparation; shared brief; one merchant approval action |
| Potential impact | Fewer manual intake and comparison steps for small commerce teams; no fabricated ROI |
| Innovation | AI advice separated from financial authority, bound to explicit customer consent |
| Presentation | One complete customer-to-merchant resolution with visible provider results |

Record measured completion time and actual manual actions if claiming time savings. Keep fallback labels visible. Paid upgrades, simulated logistics, and unfinished recovery paths must not be presented as working live integrations.

## Release verification

`pnpm -r --filter '!@resolvepay/web' build`, `pnpm --filter @resolvepay/web build`, `pnpm test`.

The local test suite uses deterministic providers and an isolated in-memory database. It does not establish live Gemini, Resend, PayPal or hosted deployment readiness. Before submission, test those credentials and record a real sandbox purchase/refund end to end.
