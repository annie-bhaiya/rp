namespace ResolvePayRescueApi.Requests.Resolutions;

/// <summary>
/// The inputs of the ResolutionsControllerGetReceipt operation.
/// </summary>
public sealed record ResolutionsControllerGetReceiptRequest
{
    /// <summary>
    /// Dispute case UUID identifier
    /// </summary>
    public required string CaseId { get; init; }
}
