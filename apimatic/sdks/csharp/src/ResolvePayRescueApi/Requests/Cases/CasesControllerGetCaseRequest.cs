namespace ResolvePayRescueApi.Requests.Cases;

/// <summary>
/// The inputs of the CasesControllerGetCase operation.
/// </summary>
public sealed record CasesControllerGetCaseRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
