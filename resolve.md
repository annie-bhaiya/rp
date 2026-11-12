# ResolvePay setup and current scope

The supported journey is the web resolution portal, with email access links. No messaging business account is required.

## Configure a real demonstration

- Set `GEMINI_API_KEY` and a supported `GEMINI_MODEL` in the server environment. The resolution brief identifies Gemini versus deterministic fallback separately for extraction and explanation.
- Set PayPal sandbox credentials, purchase through sandbox checkout, and use the resulting capture for the refund demonstration. Seeded orders simulate payment execution and do not prove PayPal API connectivity.
- Configure Resend for access emails, or inspect development copies at `/mailbox`.
- Run API and web builds, tests, then follow `docs/hackathon-demo.md`.

## Explicit limitations

- Paid upgrade exchanges are visible for comparison but cannot be selected or executed until additional-payment capture is implemented.
- Fulfillment and return carrier tracking are simulated. A merchant must record inspection; AI does not verify physical goods or photo contents.
- Provider errors are surfaced; an unsuccessful live refund is never converted into simulated success.
- This change has not deployed new cloud containers. Existing hosted URLs may still serve an earlier build.
