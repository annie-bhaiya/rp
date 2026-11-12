using ResolvePayRescueApi.Core.Models;

namespace ResolvePayRescueApi.Servers;

public class Default1Options
{
    public ProductionOptions Production { get; set; } = new();

    internal UrlTemplate Resolve(ServerEnvironment environment, string path) =>
        environment.Match(() => new UrlTemplate(Production.BaseUrl, path, []));

    public class ProductionOptions
    {
        public string BaseUrl { get; set; } = "https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io";
    }
}
