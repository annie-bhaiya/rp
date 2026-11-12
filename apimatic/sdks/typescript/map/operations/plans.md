<!-- Generated file — do not edit; regenerated with the SDK. -->

# Plans — operations

Accessor: `client.plans` · Source: `src/resources/plans.ts` · 7 operations · Request types: namespace `Plans`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `resolve-pay-rescue-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### plansControllerAcceptPlan

- **Signature**: `plansControllerAcceptPlan(request: Plans.PlansControllerAcceptPlanRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/plans/{id}/accept`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Plans.PlansControllerAcceptPlanRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### plansControllerApproveAndExecute

- **Signature**: `plansControllerApproveAndExecute(request: Plans.PlansControllerApproveAndExecuteRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/plans/{id}/approve-and-execute`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Plans.PlansControllerApproveAndExecuteRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### plansControllerApprovePlan

- **Signature**: `plansControllerApprovePlan(request: Plans.PlansControllerApprovePlanRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/plans/{id}/approve`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Plans.PlansControllerApprovePlanRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### plansControllerExecutePlan

- **Signature**: `plansControllerExecutePlan(request: Plans.PlansControllerExecutePlanRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/plans/{id}/execute`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Plans.PlansControllerExecutePlanRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### plansControllerGenerateProposals

- **Signature**: `plansControllerGenerateProposals(request: Plans.PlansControllerGenerateProposalsRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/cases/{id}/proposals`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Plans.PlansControllerGenerateProposalsRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### plansControllerGetPlans

- **Signature**: `plansControllerGetPlans(request: Plans.PlansControllerGetPlansRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/cases/{id}/plans`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Plans.PlansControllerGetPlansRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### plansControllerRejectPlan

- **Signature**: `plansControllerRejectPlan(request: Plans.PlansControllerRejectPlanRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/plans/{id}/reject`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Plans.PlansControllerRejectPlanRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

