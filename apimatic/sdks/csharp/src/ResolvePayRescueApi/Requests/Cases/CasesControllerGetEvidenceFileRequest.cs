namespace ResolvePayRescueApi.Requests.Cases;

/// <summary>
/// The inputs of the CasesControllerGetEvidenceFile operation.
/// </summary>
public sealed record CasesControllerGetEvidenceFileRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }

    /// <summary>
    /// Evidence item UUID identifier
    /// </summary>
    public required string EvidenceId { get; init; }
}
