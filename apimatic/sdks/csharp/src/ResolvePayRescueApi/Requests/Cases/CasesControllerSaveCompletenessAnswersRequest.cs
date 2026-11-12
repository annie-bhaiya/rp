namespace ResolvePayRescueApi.Requests.Cases;

/// <summary>
/// The inputs of the CasesControllerSaveCompletenessAnswers operation.
/// </summary>
public sealed record CasesControllerSaveCompletenessAnswersRequest
{
    /// <summary>
    /// Unique UUID identifier of the target resource
    /// </summary>
    public required string Id { get; init; }
}
