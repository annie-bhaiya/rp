namespace ResolvePayRescueApi.Requests.Catalog;

/// <summary>
/// The inputs of the CatalogControllerCaptureCheckoutOrder operation.
/// </summary>
public sealed record CatalogControllerCaptureCheckoutOrderRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
