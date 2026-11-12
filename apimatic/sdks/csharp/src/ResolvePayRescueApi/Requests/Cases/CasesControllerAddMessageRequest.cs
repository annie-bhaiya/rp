namespace ResolvePayRescueApi.Requests.Cases;

/// <summary>
/// The inputs of the CasesControllerAddMessage operation.
/// </summary>
public sealed record CasesControllerAddMessageRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
