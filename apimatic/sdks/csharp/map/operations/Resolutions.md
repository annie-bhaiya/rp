<!-- Generated file — do not edit; regenerated with the SDK. -->

# Resolutions — operations

Accessor: `client.Resolutions` · Source: `src/ResolvePayRescueApi/Api/Resolutions.cs` · 4 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### ResolutionsControllerGetReceipt

- **Auth**: `options.Bearer`
- **Signature**: `ResolutionsControllerGetReceipt(ResolutionsControllerGetReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `CaseId`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `ResolutionsControllerGetReceiptRequest` | `src/ResolvePayRescueApi/Requests/Resolutions/ResolutionsControllerGetReceiptRequest.cs` |

### ResolutionsControllerGetRecoveryQueue

- **Auth**: `options.Bearer`
- **Signature**: `ResolutionsControllerGetRecoveryQueue(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

### ResolutionsControllerReconcileOperation

- **Auth**: `options.Bearer`
- **Signature**: `ResolutionsControllerReconcileOperation(ResolutionsControllerReconcileOperationRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `ResolutionsControllerReconcileOperationRequest` | `src/ResolvePayRescueApi/Requests/Resolutions/ResolutionsControllerReconcileOperationRequest.cs` |

### ResolutionsControllerRecordInspection

- **Auth**: `options.Bearer`
- **Signature**: `ResolutionsControllerRecordInspection(ResolutionsControllerRecordInspectionRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `ResolutionsControllerRecordInspectionRequest` | `src/ResolvePayRescueApi/Requests/Resolutions/ResolutionsControllerRecordInspectionRequest.cs` |

