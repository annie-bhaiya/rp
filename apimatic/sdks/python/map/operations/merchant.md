<!-- Generated file — do not edit; regenerated with the SDK. -->

# Merchant — operations

Accessor: `client.merchant` · Source: `resolve_pay_rescue_api/apis/merchant.py` · 2 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.merchant.merchant_controller_export_reconciliation_csv

- **Route**: `GET /api/v1/merchant/reconciliation/export.csv`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def merchant_controller_export_reconciliation_csv(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.merchant.merchant_controller_get_insights

- **Route**: `GET /api/v1/merchant/insights`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def merchant_controller_get_insights(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

