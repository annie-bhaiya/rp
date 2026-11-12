<!-- Generated file — do not edit; regenerated with the SDK. -->

# Dev — operations

Accessor: `client.dev` · Source: `resolve_pay_rescue_api/apis/dev.py` · 5 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.dev.dev_controller_get_failure_injection

- **Route**: `GET /api/v1/dev/failure-injection`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def dev_controller_get_failure_injection(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.dev.dev_controller_get_health

- **Route**: `GET /api/v1/dev/health`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def dev_controller_get_health(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.dev.dev_controller_get_mailbox

- **Route**: `GET /api/v1/dev/mailbox`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def dev_controller_get_mailbox(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.dev.dev_controller_re_seed

- **Route**: `POST /api/v1/dev/seed`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def dev_controller_re_seed(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.dev.dev_controller_set_failure_injection

- **Route**: `POST /api/v1/dev/failure-injection`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def dev_controller_set_failure_injection(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

