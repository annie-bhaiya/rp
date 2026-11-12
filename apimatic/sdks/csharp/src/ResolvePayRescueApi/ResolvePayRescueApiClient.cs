using System.Net.Http;
using ResolvePayRescueApi.Api;
using ResolvePayRescueApi.Core;
using ResolvePayRescueApi.Core.Configuration;
using ResolvePayRescueApi.Core.Logging;
using ResolvePayRescueApi.Core.Models;

namespace ResolvePayRescueApi;

/// <summary>
/// Autonomous commerce dispute, policy planning, and remedy resolution engine
/// </summary>
public sealed class ResolvePayRescueApiClient
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    public ResolvePayRescueApiClient(HttpClient httpClient, ResolvePayRescueApiClientOptions options)
    {
        _server = new Server(options.Environment, options.Server);
        var queryParameterFactory = new QueryParameterFactory([]);
        var templateParamsFactory = new TemplateParamsFactory([]);
        var urlFactory = new UriFactory(queryParameterFactory, templateParamsFactory);
        var httpStatusPolicy = new HttpStatusPolicy([]);
        var headersFactory = new HeadersFactory([
            new HeaderParam("User-Agent", "ResolvePayRescueApiClient/1.0 CSharp"),
            new HeaderParam("X-APIMatic-Lang", "CSharp"),
            new HeaderParam("X-APIMatic-Package-Version", "1.0"),
            new HeaderParam("X-APIMatic-Gen-Version", "4.0.0"),
            new HeaderParam("X-APIMatic-OS", RuntimeEnvironment.Os),
            new HeaderParam("X-APIMatic-Runtime", RuntimeEnvironment.Runtime),
        ]);
        var resiliencePipelineFactory = new ResiliencePipelineFactory(options.Retry, options.TimeProvider);
        var httpLogger = new HttpLogger(
            options.Logging.WithEnvironmentDefaults("RESOLVE_PAY_RESCUE_API_LOG"),
            "ResolvePayRescueApiClient",
            options.TimeProvider);
        var responseContexts = new ResponseContextFactory(options.TimeProvider, options.StreamReadTimeout);
        _rawClient =
            new RawClient(
                httpClient,
                urlFactory,
                httpStatusPolicy,
                headersFactory,
                resiliencePipelineFactory,
                httpLogger,
                options.Hooks,
                responseContexts);
        _auth = new AuthSchemes(options);
    }

    /// <summary>
    /// Session management, persona authentication, and magic link access
    /// </summary>
    public Auth Auth => field ??= new Auth(_rawClient, _server, _auth);

    /// <summary>
    /// Dispute case creation, messaging timeline, evidence uploads, and completeness checking
    /// </summary>
    public Cases Cases => field ??= new Cases(_rawClient, _server, _auth);

    /// <summary>
    /// Store catalog, product variants, and checkout order lifecycle
    /// </summary>
    public Catalog Catalog => field ??= new Catalog(_rawClient, _server, _auth);

    /// <summary>
    /// Development mailbox, health checks, seed fixtures, and failure injection simulator
    /// </summary>
    public Dev Dev => field ??= new Dev(_rawClient, _server, _auth);

    /// <summary>
    /// Operational recovery queue, policy publishing, analytics insights, and subledger reconciliation
    /// </summary>
    public Merchant Merchant => field ??= new Merchant(_rawClient, _server, _auth);

    /// <summary>
    /// AI-assisted and policy-guided remedy plan proposals, acceptance, and approval
    /// </summary>
    public Plans Plans => field ??= new Plans(_rawClient, _server, _auth);

    /// <summary>
    /// Merchant policy versioning and structured rule management
    /// </summary>
    public Policies Policies => field ??= new Policies(_rawClient, _server, _auth);

    /// <summary>
    /// Physical return inspection gating, receipt generation, and resolution orchestration
    /// </summary>
    public Resolutions Resolutions => field ??= new Resolutions(_rawClient, _server, _auth);

    /// <summary>
    /// PayPal Orders v2 and Resend inbound event processing
    /// </summary>
    public WebhooksApi WebhooksApi => field ??= new WebhooksApi(_rawClient, _server, _auth);
}
