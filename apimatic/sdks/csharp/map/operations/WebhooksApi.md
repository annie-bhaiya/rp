<!-- Generated file — do not edit; regenerated with the SDK. -->

# WebhooksApi — operations

Accessor: `client.WebhooksApi` · Source: `src/ResolvePayRescueApi/Api/WebhooksApi.cs` · 4 operations

**Type sources**: the file declaring each type an operation names (`RawError` excluded — see sdk-map.md).

### WebhooksControllerHandleEmailConnectionWebhook

- **Auth**: `options.Bearer`
- **Signature**: `WebhooksControllerHandleEmailConnectionWebhook(WebhooksControllerHandleEmailConnectionWebhookRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `ConnectionKey`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `WebhooksControllerHandleEmailConnectionWebhookRequest` | `src/ResolvePayRescueApi/Requests/WebhooksApi/WebhooksControllerHandleEmailConnectionWebhookRequest.cs` |

### WebhooksControllerHandleEmailWebhook

- **Auth**: `options.Bearer`
- **Signature**: `WebhooksControllerHandleEmailWebhook(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

### WebhooksControllerHandlePayPalConnectionWebhook

- **Auth**: `options.Bearer`
- **Signature**: `WebhooksControllerHandlePayPalConnectionWebhook(WebhooksControllerHandlePayPalConnectionWebhookRequest request, RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
  - required: `ConnectionKey`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

| Type | Source |
| --- | --- |
| `WebhooksControllerHandlePayPalConnectionWebhookRequest` | `src/ResolvePayRescueApi/Requests/WebhooksApi/WebhooksControllerHandlePayPalConnectionWebhookRequest.cs` |

### WebhooksControllerHandlePayPalWebhook

- **Auth**: `options.Bearer`
- **Signature**: `WebhooksControllerHandlePayPalWebhook(RequestOptions? requestOptions = null, CancellationToken cancellationToken = default)`
- **Returns**: `void` (Task)
- **Error**: `ApiException<RawError>` — **Case B**

