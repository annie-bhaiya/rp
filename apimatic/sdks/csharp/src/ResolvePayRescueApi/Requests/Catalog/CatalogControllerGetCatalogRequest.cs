namespace ResolvePayRescueApi.Requests.Catalog;

/// <summary>
/// The inputs of the CatalogControllerGetCatalog operation.
/// </summary>
public sealed record CatalogControllerGetCatalogRequest
{
    /// <summary>
    /// Unique merchant store identifier slug
    /// </summary>
    public required string TenantSlug { get; init; }
}
