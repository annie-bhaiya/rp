namespace ResolvePayRescueApi.Requests.Plans;

/// <summary>
/// The inputs of the PlansControllerExecutePlan operation.
/// </summary>
public sealed record PlansControllerExecutePlanRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
