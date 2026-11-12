# Reference

Every operation below is shown in its throwing form. On an error status it throws `ApiException<TError>` — the status code, headers, content type and the operation's error type, `RawError` (the raw body) when the spec declares none — and where an operation offers an `…AsResult` sibling, that sibling returns `ApiResult<TResponse, TError>` instead. A request that produces no usable response surfaces as `SdkConnectionException` or `SdkTimeoutException`, a body that does not match the documented response type as `ResponseDeserializationException`, and a required credential that is not configured, or one that cannot be applied, as `AuthSchemeException`; all of them derive from `SdkException` and name the failed call. See [README → Error Handling](README.md#error-handling).

> Source: [ResolvePayRescueApiClient](src/ResolvePayRescueApi/ResolvePayRescueApiClient.cs)

## Auth

> Source: [Auth](src/ResolvePayRescueApi/Api/Auth.cs)

<details>
<summary><code>Task AuthControllerConfig(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves current authentication capability flags, including whether 1-click demo persona switching is enabled.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerConfig();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task AuthControllerGetSession(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Validates and returns the active session actor, role, tenant, and expiration from the session cookie.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerGetSession();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task AuthControllerLoginDev(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Instantly authenticates as a demo persona (OWNER, APPROVER, JUDGE, or CUSTOMER) when demo mode is active.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerLoginDev();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task AuthControllerLogout(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Revokes the active session token server-side and clears the resolvepay_session cookie.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerLogout();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task AuthControllerRedeemAccess(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeems a single-use customer access token, establishing an authenticated session with secure httpOnly cookie.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerRedeemAccess();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task AuthControllerRedeemMerchant(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Redeems a merchant login token, verifies active store membership, and establishes an authenticated merchant session.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerRedeemMerchant();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task AuthControllerRequestAccess(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Generates and delivers a single-use access link for a customer based on normalized order reference and customer email.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerRequestAccess();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task AuthControllerRequestMerchant(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Sends a magic sign-in link to a registered merchant user email for store workspace access.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Auth.AuthControllerRequestMerchant();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Cases

> Source: [Cases](src/ResolvePayRescueApi/Api/Cases.cs)

<details>
<summary><code>Task CasesControllerAddMessage(CasesControllerAddMessageRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Appends a verified customer or merchant message to the dispute case timeline.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerAddMessage(new CasesControllerAddMessageRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerAddMessageRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerAddMessageRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerCompleteEvidenceUpload(CasesControllerCompleteEvidenceUploadRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Marks evidence upload as completed and triggers policy validation checks.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerCompleteEvidenceUpload(new CasesControllerCompleteEvidenceUploadRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
        EvidenceId = "90000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerCompleteEvidenceUploadRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerCompleteEvidenceUploadRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerCreateCase(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Opens a new dispute case for an eligible order, creating initial customer complaint timeline events.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerCreateCase();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerCreateEvidenceIntent(CasesControllerCreateEvidenceIntentRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Initializes an evidence upload slot and returns target upload metadata and hash requirements.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerCreateEvidenceIntent(new CasesControllerCreateEvidenceIntentRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerCreateEvidenceIntentRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerCreateEvidenceIntentRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerGetCase(CasesControllerGetCaseRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves complete dispute case details, state machine status, and order metadata.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerGetCase(new CasesControllerGetCaseRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerGetCaseRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetCaseRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerGetCompleteness(CasesControllerGetCompletenessRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

AI-assisted evaluation of customer complaint narrative against active merchant policy clauses, generating targeted clarification questions.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerGetCompleteness(new CasesControllerGetCompletenessRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerGetCompletenessRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetCompletenessRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerGetEvidenceFile(CasesControllerGetEvidenceFileRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Downloads raw evidence file bytes for authorized merchant inspection.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerGetEvidenceFile(new CasesControllerGetEvidenceFileRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
        EvidenceId = "90000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerGetEvidenceFileRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetEvidenceFileRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerGetTimeline(CasesControllerGetTimelineRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns chronological audit events, messages, policy evaluations, and payment updates for a case.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerGetTimeline(new CasesControllerGetTimelineRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerGetTimelineRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerGetTimelineRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerListCases(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lists dispute cases scoped to the authenticated customer's order or all store cases for merchants.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerListCases();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerSaveCompletenessAnswers(CasesControllerSaveCompletenessAnswersRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Submits customer answers to targeted clarification questions, updating case constraints and re-evaluating remedy proposals.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerSaveCompletenessAnswers(new CasesControllerSaveCompletenessAnswersRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerSaveCompletenessAnswersRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerSaveCompletenessAnswersRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CasesControllerUploadEvidenceFile(CasesControllerUploadEvidenceFileRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Cases.CasesControllerUploadEvidenceFile(new CasesControllerUploadEvidenceFileRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
        EvidenceId = "90000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CasesControllerUploadEvidenceFileRequest](src/ResolvePayRescueApi/Requests/Cases/CasesControllerUploadEvidenceFileRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Catalog

> Source: [Catalog](src/ResolvePayRescueApi/Api/Catalog.cs)

<details>
<summary><code>Task CatalogControllerCaptureCheckoutOrder(CatalogControllerCaptureCheckoutOrderRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Captures authorized funds for a checkout order and records initial double-entry subledger clearing entries.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Catalog.CatalogControllerCaptureCheckoutOrder(new CatalogControllerCaptureCheckoutOrderRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CatalogControllerCaptureCheckoutOrderRequest](src/ResolvePayRescueApi/Requests/Catalog/CatalogControllerCaptureCheckoutOrderRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CatalogControllerCreateCheckoutOrder(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Initializes a purchase order with line items, calculating subtotal, tax, and total minor currency amounts.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Catalog.CatalogControllerCreateCheckoutOrder();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CatalogControllerGetCatalog(CatalogControllerGetCatalogRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves active products, product variants, pricing, and available inventory for a merchant store.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Catalog.CatalogControllerGetCatalog(new CatalogControllerGetCatalogRequest
    {
        TenantSlug = "default-merchant",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CatalogControllerGetCatalogRequest](src/ResolvePayRescueApi/Requests/Catalog/CatalogControllerGetCatalogRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task CatalogControllerGetOrder(CatalogControllerGetOrderRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves detailed order information including line items, capture IDs, and financial totals for an authorized order.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Catalog.CatalogControllerGetOrder(new CatalogControllerGetOrderRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[CatalogControllerGetOrderRequest](src/ResolvePayRescueApi/Requests/Catalog/CatalogControllerGetOrderRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Dev

> Source: [Dev](src/ResolvePayRescueApi/Api/Dev.cs)

<details>
<summary><code>Task DevControllerGetFailureInjection(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns currently active failure injection simulation mode and trigger count.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Dev.DevControllerGetFailureInjection();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task DevControllerGetHealth(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Returns service operational status, database connectivity, and tenant count.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Dev.DevControllerGetHealth();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task DevControllerGetMailbox(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Inspects synthetic outbound transactional emails and customer access links captured locally.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Dev.DevControllerGetMailbox();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task DevControllerReSeed(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Populates database with synthetic products, policies, and demo orders.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Dev.DevControllerReSeed();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task DevControllerSetFailureInjection(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Sets chaos simulation mode (PROVIDER_DROP_BEFORE_RESPONSE, PROVIDER_500, LEDGER_IMBALANCE) to test resilience.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Dev.DevControllerSetFailureInjection();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Merchant

> Source: [Merchant](src/ResolvePayRescueApi/Api/Merchant.cs)

<details>
<summary><code>Task MerchantControllerExportReconciliationCsv(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Merchant.MerchantControllerExportReconciliationCsv();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task MerchantControllerGetInsights(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Aggregates return rates, common defect categories, and resolution cost analytics.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Merchant.MerchantControllerGetInsights();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Plans

> Source: [Plans](src/ResolvePayRescueApi/Api/Plans.cs)

<details>
<summary><code>Task PlansControllerAcceptPlan(PlansControllerAcceptPlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Records customer consent to a specific remedy proposal bound strictly to its canonical hash.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Plans.PlansControllerAcceptPlan(new PlansControllerAcceptPlanRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PlansControllerAcceptPlanRequest](src/ResolvePayRescueApi/Requests/Plans/PlansControllerAcceptPlanRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task PlansControllerApproveAndExecute(PlansControllerApproveAndExecuteRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Atomically approves accepted plan and dispatches automated financial refund or inventory replacement.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Plans.PlansControllerApproveAndExecute(new PlansControllerApproveAndExecuteRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PlansControllerApproveAndExecuteRequest](src/ResolvePayRescueApi/Requests/Plans/PlansControllerApproveAndExecuteRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task PlansControllerApprovePlan(PlansControllerApprovePlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Plans.PlansControllerApprovePlan(new PlansControllerApprovePlanRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PlansControllerApprovePlanRequest](src/ResolvePayRescueApi/Requests/Plans/PlansControllerApprovePlanRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task PlansControllerExecutePlan(PlansControllerExecutePlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Executes saga orchestration steps (PayPal refund, replacement order creation, subledger balancing).

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Plans.PlansControllerExecutePlan(new PlansControllerExecutePlanRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PlansControllerExecutePlanRequest](src/ResolvePayRescueApi/Requests/Plans/PlansControllerExecutePlanRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task PlansControllerGenerateProposals(PlansControllerGenerateProposalsRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund, Replacement, Exchange).

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Plans.PlansControllerGenerateProposals(new PlansControllerGenerateProposalsRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PlansControllerGenerateProposalsRequest](src/ResolvePayRescueApi/Requests/Plans/PlansControllerGenerateProposalsRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task PlansControllerGetPlans(PlansControllerGetPlansRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lists all proposed remedy plans with exact monetary calculations and return requirements.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Plans.PlansControllerGetPlans(new PlansControllerGetPlansRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PlansControllerGetPlansRequest](src/ResolvePayRescueApi/Requests/Plans/PlansControllerGetPlansRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task PlansControllerRejectPlan(PlansControllerRejectPlanRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Rejects a proposed remedy plan and returns the case to manual review.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Plans.PlansControllerRejectPlan(new PlansControllerRejectPlanRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[PlansControllerRejectPlanRequest](src/ResolvePayRescueApi/Requests/Plans/PlansControllerRejectPlanRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Policies

> Source: [Policies](src/ResolvePayRescueApi/Api/Policies.cs)

<details>
<summary><code>Task PoliciesControllerGetPolicies(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Retrieves active return, replacement, and exchange policy versions and structured rules.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Policies.PoliciesControllerGetPolicies();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task PoliciesControllerPublishPolicy(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Publishes a new immutable policy version with SHA-256 integrity hash.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Policies.PoliciesControllerPublishPolicy();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## Resolutions

> Source: [Resolutions](src/ResolvePayRescueApi/Api/Resolutions.cs)

<details>
<summary><code>Task ResolutionsControllerGetReceipt(ResolutionsControllerGetReceiptRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Generates an immutable resolution receipt detailing approved remedy, financial refund IDs, return status, and double-entry ledger citations.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Resolutions.ResolutionsControllerGetReceipt(new ResolutionsControllerGetReceiptRequest
    {
        CaseId = "4c52b868-9844-41a3-b3d0-8de4f230fc06",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ResolutionsControllerGetReceiptRequest](src/ResolvePayRescueApi/Requests/Resolutions/ResolutionsControllerGetReceiptRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task ResolutionsControllerGetRecoveryQueue(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator reconciliation.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Resolutions.ResolutionsControllerGetRecoveryQueue();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task ResolutionsControllerReconcileOperation(ResolutionsControllerReconcileOperationRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Queries authoritative payment provider state to reconcile pending operations without duplicate disbursements.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Resolutions.ResolutionsControllerReconcileOperation(new ResolutionsControllerReconcileOperationRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ResolutionsControllerReconcileOperationRequest](src/ResolvePayRescueApi/Requests/Resolutions/ResolutionsControllerReconcileOperationRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task ResolutionsControllerRecordInspection(ResolutionsControllerRecordInspectionRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Records merchant physical inspection pass/fail status, unlocking or blocking automated resolution fund disbursement.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.Resolutions.ResolutionsControllerRecordInspection(new ResolutionsControllerRecordInspectionRequest
    {
        Id = "70000000-0000-0000-0000-000000000001",
    });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[ResolutionsControllerRecordInspectionRequest](src/ResolvePayRescueApi/Requests/Resolutions/ResolutionsControllerRecordInspectionRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

## WebhooksApi

> Source: [WebhooksApi](src/ResolvePayRescueApi/Api/WebhooksApi.cs)

<details>
<summary><code>Task WebhooksControllerHandleEmailConnectionWebhook(WebhooksControllerHandleEmailConnectionWebhookRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound email webhooks for a specific store connection key.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.WebhooksApi.WebhooksControllerHandleEmailConnectionWebhook(
        new WebhooksControllerHandleEmailConnectionWebhookRequest { ConnectionKey = "default" });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[WebhooksControllerHandleEmailConnectionWebhookRequest](src/ResolvePayRescueApi/Requests/WebhooksApi/WebhooksControllerHandleEmailConnectionWebhookRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task WebhooksControllerHandleEmailWebhook(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound Resend webhook notifications for delivery, bounce, and reply tracking.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.WebhooksApi.WebhooksControllerHandleEmailWebhook();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task WebhooksControllerHandlePayPalConnectionWebhook(WebhooksControllerHandlePayPalConnectionWebhookRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound PayPal webhook events directed to a specific merchant connection key.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.WebhooksApi.WebhooksControllerHandlePayPalConnectionWebhook(
        new WebhooksControllerHandlePayPalConnectionWebhookRequest { ConnectionKey = "default" });
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Request

<dl>
<dd>

<code>[WebhooksControllerHandlePayPalConnectionWebhookRequest](src/ResolvePayRescueApi/Requests/WebhooksApi/WebhooksControllerHandlePayPalConnectionWebhookRequest.cs)</code>

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

<details>
<summary><code>Task WebhooksControllerHandlePayPalWebhook(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default);</code></summary>

<dl>
<dd>

### Description

<dl>
<dd>

Processes inbound PayPal payment capture, authorization, and refund events.

</dd>
</dl>

### Usage

<dl>
<dd>

```csharp
try
{
    await client.WebhooksApi.WebhooksControllerHandlePayPalWebhook();
}
catch (ApiException<RawError> ex)
{
    // TODO: Handle 'ex.Error' of type RawError
}
```

</dd>
</dl>

### Response

<dl>
<dd>

**OnSuccess**: No content

**OnError**: <code>[ApiException](src/ResolvePayRescueApi/Core/Exceptions/ApiException.cs)&lt;[RawError](src/ResolvePayRescueApi/Core/ErrorResponse/RawError.cs)&gt;</code>

</dd>
</dl>

</dd>
</dl>

</details>

