using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using ResolvePayRescueApi.Core;
using ResolvePayRescueApi.Core.ErrorResponse;
using ResolvePayRescueApi.Core.Exceptions;
using ResolvePayRescueApi.Core.Request;
using ResolvePayRescueApi.Core.Response;

namespace ResolvePayRescueApi.Api;

/// <summary>
/// Operational recovery queue, policy publishing, analytics insights, and subledger reconciliation
/// </summary>
public sealed class Merchant
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Merchant(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Export Subledger CSV
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RawError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.
    /// </remarks>
    public Task MerchantControllerExportReconciliationCsv(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/v1/merchant/reconciliation/export.csv"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            VoidResponse.Instance,
            RawErrorResponse.Instance,
            _auth.Bearer,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get Dispute Insights
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RawError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Aggregates return rates, common defect categories, and resolution cost analytics.
    /// </remarks>
    public Task MerchantControllerGetInsights(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/v1/merchant/insights"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            VoidResponse.Instance,
            RawErrorResponse.Instance,
            _auth.Bearer,
            requestOptions,
            cancellationToken);
}
