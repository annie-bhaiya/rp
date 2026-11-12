<!-- Generated file — do not edit; regenerated with the SDK. -->

# Resolutions — operations

Accessor: `client.resolutions` · Source: `resolve_pay_rescue_api/apis/resolutions.py` · 4 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.resolutions.resolutions_controller_get_receipt

- **Route**: `GET /api/v1/cases/{caseId}/receipt`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def resolutions_controller_get_receipt(case_id: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `case_id`
- **Params**: `case_id` — path `caseId`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.resolutions.resolutions_controller_get_recovery_queue

- **Route**: `GET /api/v1/merchant/recovery`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def resolutions_controller_get_recovery_queue(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.resolutions.resolutions_controller_reconcile_operation

- **Route**: `POST /api/v1/merchant/recovery/{id}/reconcile`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def resolutions_controller_reconcile_operation(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.resolutions.resolutions_controller_record_inspection

- **Route**: `POST /api/v1/returns/{id}/inspection`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def resolutions_controller_record_inspection(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

