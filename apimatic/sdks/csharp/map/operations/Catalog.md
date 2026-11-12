<!-- Generated file — do not edit; regenerated with the SDK. -->

# Catalog — operations

Accessor: `client.Catalog` · Source: `src/ResolvePayRescueApi/Api/Catalog.cs` · 4 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### CatalogControllerCaptureCheckoutOrder

- **Auth**: `options.Bearer`
- **Signature**: `CatalogControllerCaptureCheckoutOrder(CatalogControllerCaptureCheckoutOrderRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CatalogControllerCaptureCheckoutOrderRequest` | `src/ResolvePayRescueApi/Requests/Catalog/CatalogControllerCaptureCheckoutOrderRequest.cs` |

### CatalogControllerCreateCheckoutOrder

- **Auth**: `options.Bearer`
- **Signature**: `CatalogControllerCreateCheckoutOrder(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

### CatalogControllerGetCatalog

- **Auth**: `options.Bearer`
- **Signature**: `CatalogControllerGetCatalog(CatalogControllerGetCatalogRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `TenantSlug`
- **Query params (wire ← C#)**: `tenantSlug` ← `TenantSlug`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CatalogControllerGetCatalogRequest` | `src/ResolvePayRescueApi/Requests/Catalog/CatalogControllerGetCatalogRequest.cs` |

### CatalogControllerGetOrder

- **Auth**: `options.Bearer`
- **Signature**: `CatalogControllerGetOrder(CatalogControllerGetOrderRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CatalogControllerGetOrderRequest` | `src/ResolvePayRescueApi/Requests/Catalog/CatalogControllerGetOrderRequest.cs` |

