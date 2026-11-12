using System.Net.Http;

namespace ResolvePayRescueApi.Core.Request;

internal interface IRequest
{
    HttpContent Get();

    bool CanRetry { get; }
}
