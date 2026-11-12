<!-- Generated file — do not edit; regenerated with the SDK. -->

# Plans — operations

Accessor: `client.plans` · Source: `resolve_pay_rescue_api/apis/plans.py` · 7 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.plans.plans_controller_accept_plan

- **Route**: `POST /api/v1/plans/{id}/accept`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def plans_controller_accept_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.plans.plans_controller_approve_and_execute

- **Route**: `POST /api/v1/plans/{id}/approve-and-execute`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def plans_controller_approve_and_execute(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.plans.plans_controller_approve_plan

- **Route**: `POST /api/v1/plans/{id}/approve`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def plans_controller_approve_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.plans.plans_controller_execute_plan

- **Route**: `POST /api/v1/plans/{id}/execute`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def plans_controller_execute_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.plans.plans_controller_generate_proposals

- **Route**: `POST /api/v1/cases/{id}/proposals`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def plans_controller_generate_proposals(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.plans.plans_controller_get_plans

- **Route**: `GET /api/v1/cases/{id}/plans`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def plans_controller_get_plans(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.plans.plans_controller_reject_plan

- **Route**: `POST /api/v1/plans/{id}/reject`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def plans_controller_reject_plan(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

