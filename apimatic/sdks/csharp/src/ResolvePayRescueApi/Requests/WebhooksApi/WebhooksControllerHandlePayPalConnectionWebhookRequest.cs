namespace ResolvePayRescueApi.Requests.WebhooksApi;

/// <summary>
/// The inputs of the WebhooksControllerHandlePayPalConnectionWebhook operation.
/// </summary>
public sealed record WebhooksControllerHandlePayPalConnectionWebhookRequest
{
    /// <summary>
    /// Webhook store connection identifier key
    /// </summary>
    public required string ConnectionKey { get; init; }
}
