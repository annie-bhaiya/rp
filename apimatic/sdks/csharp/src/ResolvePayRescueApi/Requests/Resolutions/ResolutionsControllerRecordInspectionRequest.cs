namespace ResolvePayRescueApi.Requests.Resolutions;

/// <summary>
/// The inputs of the ResolutionsControllerRecordInspection operation.
/// </summary>
public sealed record ResolutionsControllerRecordInspectionRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
