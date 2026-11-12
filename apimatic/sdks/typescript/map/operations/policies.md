<!-- Generated file — do not edit; regenerated with the SDK. -->

# Policies — operations

Accessor: `client.policies` · Source: `src/resources/policies.ts` · 2 operations · Request types: namespace `Policies`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `resolve-pay-rescue-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### policiesControllerGetPolicies

- **Signature**: `policiesControllerGetPolicies(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/merchant/policies`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### policiesControllerPublishPolicy

- **Signature**: `policiesControllerPublishPolicy(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/merchant/policies/publish`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

