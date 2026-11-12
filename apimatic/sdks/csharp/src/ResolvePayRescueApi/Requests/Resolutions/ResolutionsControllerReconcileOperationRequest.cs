namespace ResolvePayRescueApi.Requests.Resolutions;

/// <summary>
/// The inputs of the ResolutionsControllerReconcileOperation operation.
/// </summary>
public sealed record ResolutionsControllerReconcileOperationRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
