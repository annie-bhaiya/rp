namespace ResolvePayRescueApi.Requests.Plans;

/// <summary>
/// The inputs of the PlansControllerApprovePlan operation.
/// </summary>
public sealed record PlansControllerApprovePlanRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
