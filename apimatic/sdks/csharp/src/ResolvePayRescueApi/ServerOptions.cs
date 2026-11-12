using ResolvePayRescueApi.Servers;

namespace ResolvePayRescueApi;

public class ServerOptions
{
    public DefaultOptions Default { get; set; } = new();
    public Default1Options Default1 { get; set; } = new();
}
