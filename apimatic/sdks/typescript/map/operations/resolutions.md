<!-- Generated file — do not edit; regenerated with the SDK. -->

# Resolutions — operations

Accessor: `client.resolutions` · Source: `src/resources/resolutions.ts` · 4 operations · Request types: namespace `Resolutions`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `resolve-pay-rescue-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### resolutionsControllerGetReceipt

- **Signature**: `resolutionsControllerGetReceipt(request: Resolutions.ResolutionsControllerGetReceiptRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/cases/{caseId}/receipt`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Resolutions.ResolutionsControllerGetReceiptRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `caseId` | `path` | `string` | yes |

### resolutionsControllerGetRecoveryQueue

- **Signature**: `resolutionsControllerGetRecoveryQueue(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/merchant/recovery`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### resolutionsControllerReconcileOperation

- **Signature**: `resolutionsControllerReconcileOperation(request: Resolutions.ResolutionsControllerReconcileOperationRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/merchant/recovery/{id}/reconcile`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Resolutions.ResolutionsControllerReconcileOperationRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### resolutionsControllerRecordInspection

- **Signature**: `resolutionsControllerRecordInspection(request: Resolutions.ResolutionsControllerRecordInspectionRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/returns/{id}/inspection`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Resolutions.ResolutionsControllerRecordInspectionRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

