<!-- Generated file — do not edit; regenerated with the SDK. -->

# Catalog — operations

Accessor: `client.catalog` · Source: `src/resources/catalog.ts` · 4 operations · Request types: namespace `Catalog`

**Type sources**: every type an operation names, with the file that declares it and the schema value exported beside it. Import every name from `resolve-pay-rescue-api`; the `Source` path is where to **read** the shape, never what to import. `ApiError`, the runtime error family and the file vocabulary are excluded — see sdk-map.md.

### catalogControllerCaptureCheckoutOrder

- **Signature**: `catalogControllerCaptureCheckoutOrder(request: Catalog.CatalogControllerCaptureCheckoutOrderRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/checkout/orders/{id}/capture`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Catalog.CatalogControllerCaptureCheckoutOrderRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

### catalogControllerCreateCheckoutOrder

- **Signature**: `catalogControllerCreateCheckoutOrder(options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `POST /api/v1/checkout/orders`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **SDK-sent**: `header Idempotency-Key` (minted per call)
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

### catalogControllerGetCatalog

- **Signature**: `catalogControllerGetCatalog(request: Catalog.CatalogControllerGetCatalogRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/catalog`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Catalog.CatalogControllerGetCatalogRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `tenantSlug` | `query` | `string` | yes |

### catalogControllerGetOrder

- **Signature**: `catalogControllerGetOrder(request: Catalog.CatalogControllerGetOrderRequest, options?: RequestOptions): ApiPromise<undefined, ApiError>`
- **Wire**: `GET /api/v1/orders/{id}`
- **Auth**: `bearer`
- **Request body**: none — no `Content-Type` header is sent
- **Returns**: `undefined` — the operation resolves to nothing
- **Error**: `ResolvePayRescueApiError` with `kind: "api"` — untyped, `payload.kind` always `"undeclared"`

**Fields** — `Catalog.CatalogControllerGetOrderRequest` (1):

| Field | Channel | Type | Req |
| --- | --- | --- | --- |
| `id` | `path` | `string` | yes |

