<!-- Generated file — do not edit; regenerated with the SDK. -->

# Cases — operations

Accessor: `client.Cases` · Source: `src/ResolvePayRescueApi/Api/Cases.cs` · 11 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### CasesControllerAddMessage

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerAddMessage(CasesControllerAddMessageRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerAddMessageRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerAddMessageRequest.cs` |

### CasesControllerCompleteEvidenceUpload

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerCompleteEvidenceUpload(CasesControllerCompleteEvidenceUploadRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `EvidenceId`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerCompleteEvidenceUploadRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerCompleteEvidenceUploadRequest.cs` |

### CasesControllerCreateCase

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerCreateCase(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

### CasesControllerCreateEvidenceIntent

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerCreateEvidenceIntent(CasesControllerCreateEvidenceIntentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerCreateEvidenceIntentRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerCreateEvidenceIntentRequest.cs` |

### CasesControllerGetCase

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerGetCase(CasesControllerGetCaseRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerGetCaseRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetCaseRequest.cs` |

### CasesControllerGetCompleteness

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerGetCompleteness(CasesControllerGetCompletenessRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerGetCompletenessRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetCompletenessRequest.cs` |

### CasesControllerGetEvidenceFile

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerGetEvidenceFile(CasesControllerGetEvidenceFileRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `EvidenceId`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerGetEvidenceFileRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetEvidenceFileRequest.cs` |

### CasesControllerGetTimeline

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerGetTimeline(CasesControllerGetTimelineRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerGetTimelineRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetTimelineRequest.cs` |

### CasesControllerListCases

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerListCases(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

### CasesControllerSaveCompletenessAnswers

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerSaveCompletenessAnswers(CasesControllerSaveCompletenessAnswersRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerSaveCompletenessAnswersRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerSaveCompletenessAnswersRequest.cs` |

### CasesControllerUploadEvidenceFile

- **Auth**: `options.Bearer`
- **Signature**: `CasesControllerUploadEvidenceFile(CasesControllerUploadEvidenceFileRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `Id`, `EvidenceId`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `CasesControllerUploadEvidenceFileRequest` | `src/ResolvePayRescueApi/Requests/Cases/CasesControllerUploadEvidenceFileRequest.cs` |

