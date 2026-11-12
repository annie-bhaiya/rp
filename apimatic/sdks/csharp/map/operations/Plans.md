<!-- Generated file — do not edit; regenerated with the SDK. -->

# Plans — operations

Accessor: `client.Plans` · Source: `src/ResolvePayRescueApi/Api/Plans.cs` · 7 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### PlansControllerAcceptPlan

- **Auth**: `options.Bearer`
- **Signature**: `PlansControllerAcceptPlan(PlansControllerAcceptPlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `PlansControllerAcceptPlanRequest` | `src/ResolvePayRescueApi/Requests/Plans/PlansControllerAcceptPlanRequest.cs` |

### PlansControllerApproveAndExecute

- **Auth**: `options.Bearer`
- **Signature**: `PlansControllerApproveAndExecute(PlansControllerApproveAndExecuteRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `PlansControllerApproveAndExecuteRequest` | `src/ResolvePayRescueApi/Requests/Plans/PlansControllerApproveAndExecuteRequest.cs` |

### PlansControllerApprovePlan

- **Auth**: `options.Bearer`
- **Signature**: `PlansControllerApprovePlan(PlansControllerApprovePlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `PlansControllerApprovePlanRequest` | `src/ResolvePayRescueApi/Requests/Plans/PlansControllerApprovePlanRequest.cs` |

### PlansControllerExecutePlan

- **Auth**: `options.Bearer`
- **Signature**: `PlansControllerExecutePlan(PlansControllerExecutePlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `PlansControllerExecutePlanRequest` | `src/ResolvePayRescueApi/Requests/Plans/PlansControllerExecutePlanRequest.cs` |

### PlansControllerGenerateProposals

- **Auth**: `options.Bearer`
- **Signature**: `PlansControllerGenerateProposals(PlansControllerGenerateProposalsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `PlansControllerGenerateProposalsRequest` | `src/ResolvePayRescueApi/Requests/Plans/PlansControllerGenerateProposalsRequest.cs` |

### PlansControllerGetPlans

- **Auth**: `options.Bearer`
- **Signature**: `PlansControllerGetPlans(PlansControllerGetPlansRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `PlansControllerGetPlansRequest` | `src/ResolvePayRescueApi/Requests/Plans/PlansControllerGetPlansRequest.cs` |

### PlansControllerRejectPlan

- **Auth**: `options.Bearer`
- **Signature**: `PlansControllerRejectPlan(PlansControllerRejectPlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `PlansControllerRejectPlanRequest` | `src/ResolvePayRescueApi/Requests/Plans/PlansControllerRejectPlanRequest.cs` |

