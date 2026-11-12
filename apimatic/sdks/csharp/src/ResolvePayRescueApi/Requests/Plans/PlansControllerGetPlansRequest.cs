namespace ResolvePayRescueApi.Requests.Plans;

/// <summary>
/// The inputs of the PlansControllerGetPlans operation.
/// </summary>
public sealed record PlansControllerGetPlansRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
