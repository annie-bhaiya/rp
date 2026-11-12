using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using ResolvePayRescueApi.Core;
using ResolvePayRescueApi.Core.ErrorResponse;
using ResolvePayRescueApi.Core.Exceptions;
using ResolvePayRescueApi.Core.Models;
using ResolvePayRescueApi.Core.Request;
using ResolvePayRescueApi.Core.Response;

namespace ResolvePayRescueApi.Api;

/// <summary>
/// Merchant policy versioning and structured rule management
/// </summary>
public sealed class Policies
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Policies(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Get Merchant Policies
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RawError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Retrieves active return, replacement, and exchange policy versions and structured rules.
    /// </remarks>
    public Task PoliciesControllerGetPolicies(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/v1/merchant/policies"),
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
    /// Publish Policy Version
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RawError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Publishes a new immutable policy version with SHA-256 integrity hash.
    /// </remarks>
    public Task PoliciesControllerPublishPolicy(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/v1/merchant/policies/publish"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            EmptyBody.Instance,
            VoidResponse.Instance,
            RawErrorResponse.Instance,
            _auth.Bearer,
            requestOptions,
            cancellationToken);
}
