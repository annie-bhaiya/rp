namespace ResolvePayRescueApi.Requests.WebhooksApi;

/// <summary>
/// The inputs of the WebhooksControllerHandleEmailConnectionWebhook operation.
/// </summary>
public sealed record WebhooksControllerHandleEmailConnectionWebhookRequest
{
    /// <summary>
    /// Webhook store connection identifier key
    /// </summary>
    public required string ConnectionKey { get; init; }
}
