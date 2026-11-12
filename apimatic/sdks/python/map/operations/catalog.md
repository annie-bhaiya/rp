<!-- Generated file — do not edit; regenerated with the SDK. -->

# Catalog — operations

Accessor: `client.catalog` · Source: `resolve_pay_rescue_api/apis/catalog.py` · 4 operations

Each `###` block is one operation and assumes `sdk-map.md` is loaded: blocks omit what its invariants table covers and are otherwise self-contained, so chunk at block level. Signatures are the sync parsed spelling; the async and raw spellings take the same parameters (see sdk-map.md). **Type sources** names the module declaring each type an operation mentions, so resolving a body, return or error payload is a lookup rather than a search; the runtime types `RawError` and `ApiResult` are excluded, and an operation with no table mentions nothing but builtins and those.

### client.catalog.catalog_controller_capture_checkout_order

- **Route**: `POST /api/v1/checkout/orders/{id}/capture`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def catalog_controller_capture_checkout_order(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.catalog.catalog_controller_create_checkout_order

- **Route**: `POST /api/v1/checkout/orders`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def catalog_controller_create_checkout_order(*, request_options: RequestOptionsOrDict | None = None)`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.catalog.catalog_controller_get_catalog

- **Route**: `GET /api/v1/catalog`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def catalog_controller_get_catalog(tenant_slug: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `tenant_slug`
- **Params**: `tenant_slug` — query `tenantSlug`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

### client.catalog.catalog_controller_get_order

- **Route**: `GET /api/v1/orders/{id}`
- **Auth**: `bearer`
- **Server**: `default`
- **Signature**: `def catalog_controller_get_order(id_: str, *, request_options: RequestOptionsOrDict | None = None)`
  - required, positional: `id_`
- **Params**: `id_` — path `id`
- **Returns (parsed)**: `None`
- **Returns (raw)**: `ApiResult[None, RawError]`
- **Error**: `RawError` — **Case B**

