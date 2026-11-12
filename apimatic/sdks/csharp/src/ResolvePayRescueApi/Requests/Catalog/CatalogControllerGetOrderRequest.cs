namespace ResolvePayRescueApi.Requests.Catalog;

/// <summary>
/// The inputs of the CatalogControllerGetOrder operation.
/// </summary>
public sealed record CatalogControllerGetOrderRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
