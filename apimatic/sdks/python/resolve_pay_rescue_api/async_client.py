from __future__ import annotations

from functools import cached_property
from types import TracebackType

from typing_extensions import Self

from .apis.auth_api import AsyncAuthApi
from .apis.cases import AsyncCases
from .apis.catalog import AsyncCatalog
from .apis.dev import AsyncDev
from .apis.merchant import AsyncMerchant
from .apis.plans import AsyncPlans
from .apis.policies import AsyncPolicies
from .apis.resolutions import AsyncResolutions
from .apis.webhooks import AsyncWebhooks
from .auth import AsyncAuthSchemes
from .base_client import DEFAULT_TIMEOUT, BaseResolvePayRescueApiClient
from .core import (
    OPERATING_SYSTEM,
    PYTHON_RUNTIME,
    AsyncHttpClient,
    AsyncHttpx2Client,
    AsyncRawClient,
    BearerAuthScheme,
    LoggingOptionsOrDict,
    RetryOptionsOrDict,
    no_auth,
    param,
)
from .server.server_config import ServerConfigOrDict


class AsyncResolvePayRescueApiClient(BaseResolvePayRescueApiClient[AsyncRawClient]):
    def __init__(
        self,
        *,
        server_config: ServerConfigOrDict | None = None,
        timeout: float = DEFAULT_TIMEOUT,
        retry_options: int | RetryOptionsOrDict | None = None,
        logging_options: LoggingOptionsOrDict | None = None,
        custom_async_http_client: AsyncHttpClient | None = None,
        bearer: str | None = None,
    ) -> None:
        super().__init__(
            server_config=server_config, timeout=timeout, retry_options=retry_options, logging_options=logging_options
        )
        self._raw_client = AsyncRawClient(
            http_client=(
                custom_async_http_client if custom_async_http_client is not None else AsyncHttpx2Client(timeout=timeout)
            ),
            retry_options=self._retry_options,
            logging_options=self._logging_options,
            global_headers=[
                param[str]("User-Agent", "ResolvePayRescueApiClient/1.0 Python"),
                param[str]("X-APIMatic-Lang", "Python"),
                param[str]("X-APIMatic-Package-Version", "1.0"),
                param[str]("X-APIMatic-Gen-Version", "4.0.0"),
                param[str]("X-APIMatic-OS", OPERATING_SYSTEM),
                param[str]("X-APIMatic-Runtime", PYTHON_RUNTIME),
            ],
        )
        self._auth = AsyncAuthSchemes(bearer=BearerAuthScheme(bearer) if bearer is not None else no_auth)

    @cached_property
    def auth_api(self) -> AsyncAuthApi:
        return AsyncAuthApi(self._raw_client, self._server, self._auth)

    @cached_property
    def cases(self) -> AsyncCases:
        return AsyncCases(self._raw_client, self._server, self._auth)

    @cached_property
    def catalog(self) -> AsyncCatalog:
        return AsyncCatalog(self._raw_client, self._server, self._auth)

    @cached_property
    def dev(self) -> AsyncDev:
        return AsyncDev(self._raw_client, self._server, self._auth)

    @cached_property
    def merchant(self) -> AsyncMerchant:
        return AsyncMerchant(self._raw_client, self._server, self._auth)

    @cached_property
    def plans(self) -> AsyncPlans:
        return AsyncPlans(self._raw_client, self._server, self._auth)

    @cached_property
    def policies(self) -> AsyncPolicies:
        return AsyncPolicies(self._raw_client, self._server, self._auth)

    @cached_property
    def resolutions(self) -> AsyncResolutions:
        return AsyncResolutions(self._raw_client, self._server, self._auth)

    @cached_property
    def webhooks(self) -> AsyncWebhooks:
        return AsyncWebhooks(self._raw_client, self._server, self._auth)

    async def aclose(self) -> None:
        await self._raw_client.http_client.aclose()

    async def __aenter__(self) -> Self:
        return self

    async def __aexit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, exc_tb: TracebackType | None
    ) -> None:
        await self.aclose()


AsyncClient = AsyncResolvePayRescueApiClient
