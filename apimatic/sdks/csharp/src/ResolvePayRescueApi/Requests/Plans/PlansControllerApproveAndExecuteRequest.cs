namespace ResolvePayRescueApi.Requests.Plans;

/// <summary>
/// The inputs of the PlansControllerApproveAndExecute operation.
/// </summary>
public sealed record PlansControllerApproveAndExecuteRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
