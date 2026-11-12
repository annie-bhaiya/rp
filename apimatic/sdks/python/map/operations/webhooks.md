<!-- Generated file — do not edit; regenerated with the SDK. -->

# Webhooks — operations

Accessor: `client.webhooks` · Source: `resolve_pay_rescue_api/apis/webhooks.py` · 4 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.webhooks.webhooks_controller_handle_email_connection_webhook

- **Route**: `POST /api/v1/webhooks/email/{connectionKey}`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def webhooks_controller_handle_email_connection_webhook(connection_key: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `connection_key`
- **Params**: `connection_key` — path `connectionKey`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.webhooks.webhooks_controller_handle_email_webhook

- **Route**: `POST /api/v1/webhooks/email`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def webhooks_controller_handle_email_webhook(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.webhooks.webhooks_controller_handle_pay_pal_connection_webhook

- **Route**: `POST /api/v1/webhooks/paypal/{connectionKey}`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def webhooks_controller_handle_pay_pal_connection_webhook(connection_key: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `connection_key`
- **Params**: `connection_key` — path `connectionKey`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.webhooks.webhooks_controller_handle_pay_pal_webhook

- **Route**: `POST /api/v1/webhooks/paypal`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def webhooks_controller_handle_pay_pal_webhook(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

