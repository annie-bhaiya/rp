using ResolvePayRescueApi.Core;
using ResolvePayRescueApi.Core.Authentication;
using ResolvePayRescueApi.Core.Authentication.Bearer;

namespace ResolvePayRescueApi;

internal sealed class AuthSchemes
{
    public IAuthScheme Bearer { get; }

    public AuthSchemes(ResolvePayRescueApiClientOptions options)
    {
        Bearer =
            BearerAuthScheme.Create(
                "Bearer",
                options.BearerProvider,
                options.Bearer ?? EnvironmentVariables.Get("RESOLVE_PAY_RESCUE_API_BEARER"));
    }
}
