namespace ResolvePayRescueApi.Requests.Plans;

/// <summary>
/// The inputs of the PlansControllerGenerateProposals operation.
/// </summary>
public sealed record PlansControllerGenerateProposalsRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
