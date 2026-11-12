using System.Threading;
using System.Threading.Tasks;
using ResolvePayRescueApi.Core.Models;

namespace ResolvePayRescueApi.Core.ErrorResponse;

internal interface IErrorResponse<TError>
{
    Task<TError> Map(ResponseContext context, CancellationToken cancellationToken);
}
