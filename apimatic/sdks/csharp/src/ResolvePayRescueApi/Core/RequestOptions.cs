using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using ResolvePayRescueApi.Core.Hooks;
using ResolvePayRescueApi.Core.Models;

namespace ResolvePayRescueApi.Core;

public sealed record RequestOptions
{
    public LogLevel? LogLevel { get; init; }

    public IReadOnlyList<HeaderParam>? Headers { get; init; }

    public IReadOnlyList<SdkHook>? Hooks { get; init; }
}
