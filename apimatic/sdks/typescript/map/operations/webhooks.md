<!-- Generated file — do not edit; regenerated with the SDK. -->

# Webhooks — operations

Accessor: `client.webhooks` · Source: `src/resources/webhooks.ts` · 4 operations · Request types: namespace `Webhooks`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `resolve-pay-rescue-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### webhooksControllerHandleEmailConnectionWebhook

- **Signature**: `webhooksControllerHandleEmailConnectionWebhook(request: Webhooks.WebhooksControllerHandleEmailConnectionWebhookRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/webhooks/email/{connectionKey}`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Webhooks.WebhooksControllerHandleEmailConnectionWebhookRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `connectionKey` | `path` | `string` | yes |

### webhooksControllerHandleEmailWebhook

- **Signature**: `webhooksControllerHandleEmailWebhook(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/webhooks/email`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### webhooksControllerHandlePayPalConnectionWebhook

- **Signature**: `webhooksControllerHandlePayPalConnectionWebhook(request: Webhooks.WebhooksControllerHandlePayPalConnectionWebhookRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/webhooks/paypal/{connectionKey}`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Webhooks.WebhooksControllerHandlePayPalConnectionWebhookRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `connectionKey` | `path` | `string` | yes |

### webhooksControllerHandlePayPalWebhook

- **Signature**: `webhooksControllerHandlePayPalWebhook(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/webhooks/paypal`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

