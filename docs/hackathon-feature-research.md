# ResolvePay: hackathon feature decision brief

Researched November 11, 2026. Recommendations below are proposals, not implemented features or a guarantee of winning.

## Recommendation

Position ResolvePay as **a resolution agent whose financial actions can be verified**. The existing code already includes complaint extraction, policy-constrained plans, consent, merchant approval, PayPal adapters, recovery handling, and a ledger. Strengthen that complete journey before adding more integrations.

## Official constraints

Submission closes November 12 at noon Pacific: November 13, 2026, 1:30 AM IST. The five equally weighted criteria are technical implementation, design, impact, innovation, and presentation; technical implementation is the first tiebreaker. A working demo or complete setup instructions, public open-source repository with a license, and public YouTube video under three minutes are required. Judges need free access through judging. Existing projects must explain significant changes during the build window.

Eligibility is a separate prerequisite: individuals and team members must meet the age-of-majority requirement. If the profile age of 16 is still current, obtain an organizer determination before relying on eligibility; an adult representative does not automatically resolve member eligibility.

Source: https://paypalaihackathon.devpost.com/rules

## Competitive evidence and product gap

Loop already offers AI recommendations based on return reasons, historical exchanges, and available variants. Thus, an AI replacement recommendation alone is weak differentiation. Loop's documentation is evidence of existing capability, not independent evidence of its performance.

Source: https://help.loopreturns.com/en/articles/11380097

PayPal supports dispute retrieval, lifecycle-specific responses, evidence, and webhooks. ResolvePay's internal cases must not be presented as synchronized PayPal disputes until that integration exists. PayPal also documents idempotent retries using PayPal-Request-Id where supported, subject to endpoint-specific retention. This supports a credible recovery demonstration, but not an unlimited exactly-once guarantee.

Sources:
- https://developer.paypal.com/api/disputes/
- https://developer.paypal.com/api/rest/reference/idempotency/

## Prioritized proposals requiring approval

Effort ranges are engineering estimates for this repository, not commitments. They exclude credential provisioning and unpredictable provider debugging.

| Priority | Proposal | Smallest useful implementation | Estimated effort | Acceptance evidence |
|---|---|---|---|---|
| 1 | Resolution receipt | One readable view of complaint, actual AI/fallback source, cited policy version, accepted amount, customer consent, merchant authorization, provider status/ID, and balanced ledger entries | 3–5 hours | A reviewer can trace one refund from request to provider result; missing verification is explicitly pending |
| 2 | Recovery demonstration | Sandbox-only failure injection around one existing refund step; visible pending state; reconcile before retry; retain operation identifier | 4–7 hours | A lost response and repeated click produce one provider refund and no duplicate ledger posting |
| 3 | Evidence completeness assistant | Compare existing complaint and evidence descriptions with policy requirements; ask only missing questions; save answers; regenerate only unaccepted plans | 4–6 hours | Incomplete complaint asks a targeted follow-up; complete complaint proceeds; AI never asserts it inspected an image |
| 4 | PayPal dispute evidence copilot | Read a sandbox dispute and draft an evidence packet with source references; merchant previews before submission | 8–14 hours | Actual PayPal dispute ID, current required action, validated document mapping, and confirmed submission; no invented win probability |
| 5 | Budgeted merchant automation | Explicit opt-in mandate with per-case and daily limits, eligible policy paths, expiry, audit history, and escalation | 10–16 hours | Concurrent cases cannot overspend; uncertain evidence escalates; customer consent remains required |
| 6 | Cross-catalog exchange discovery | Add Channel3 candidates only when local inventory cannot satisfy a request; verify availability and costs before presenting an offer | 8–14 hours | Genuine retrieval with attribution; no invented availability, fulfillment or shipping guarantees |

**Approve priorities 1 and 2 first.** Together they expose the strongest existing engineering in a short demo. Add priority 3 only after the core sandbox journey is stable. Defer priorities 4–6 until after submission unless there is substantially more time than the published deadline permits.

The official sponsor page lists Channel3, AG Grid, APIMatic, Render and other partners. Sponsor integration is optional. A tool earns its place only if it improves the demonstrated user task; adding a grid or SDK solely for a badge risks spending the remaining time on presentation surface instead of a reliable outcome.

Source: https://developer.paypal.com/community/blog/PayPal_AI_Hackathon/

## Demo and measurement plan

Aim for 2 minutes 45 seconds: 20 seconds on the merchant/customer problem; 35 on complaint and actual AI output; 30 on exact remedy and consent; 30 on merchant approval and real sandbox result; 35 on recovery and receipt; 15 on measured outcome and limitations.

Measure elapsed complaint-to-approved-remedy time, manual actions, successful provider refunds, duplicate postings after retries, and unsupported AI recommendations across fixed cases. Compare against a documented manual baseline if claiming savings. Do not claim chargeback reduction, production reliability, or customer ROI from synthetic examples.

Before recording: verify real sandbox purchase/refund and configured AI, label simulated logistics and fallback reasoning, confirm judge access, include a license selected by the project owner, document setup, and ensure the recorded behavior matches the submitted commit. Do not publish keys in the public repository.

## Current implementation boundary

This pass improves the existing authentication and UX, including session failure recovery, expiry handling, cache cancellation at identity changes, inactive-store link rejection, resolution polling, and protection against showing a new-complaint form while an existing case loads. The proposed features above remain unimplemented pending the user's choice.
