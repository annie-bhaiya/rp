<!-- Generated file — do not edit; regenerated with the SDK. -->

# Dev — operations

Accessor: `client.dev` · Source: `src/resources/dev.ts` · 5 operations · Request types: namespace `Dev`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `resolve-pay-rescue-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### devControllerGetFailureInjection

- **Signature**: `devControllerGetFailureInjection(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/dev/failure-injection`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### devControllerGetHealth

- **Signature**: `devControllerGetHealth(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/dev/health`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### devControllerGetMailbox

- **Signature**: `devControllerGetMailbox(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/dev/mailbox`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### devControllerReSeed

- **Signature**: `devControllerReSeed(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/dev/seed`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### devControllerSetFailureInjection

- **Signature**: `devControllerSetFailureInjection(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/dev/failure-injection`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

