namespace ResolvePayRescueApi.Requests.Cases;

/// <summary>
/// The inputs of the CasesControllerGetTimeline operation.
/// </summary>
public sealed record CasesControllerGetTimelineRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
