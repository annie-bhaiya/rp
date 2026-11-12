from __future__ import annotations

from functools import cached_property
from types import TracebackType

from typing_extensions import Self

from .apis.auth_api import AuthApi
from .apis.cases import Cases
from .apis.catalog import Catalog
from .apis.dev import Dev
from .apis.merchant import Merchant
from .apis.plans import Plans
from .apis.policies import Policies
from .apis.resolutions import Resolutions
from .apis.webhooks import Webhooks
from .auth import AuthSchemes
from .base_client import DEFAULT_TIMEOUT, BaseResolvePayRescueApiClient
from .core import (
    OPERATING_SYSTEM,
    PYTHON_RUNTIME,
    BearerAuthScheme,
    HttpClient,
    Httpx2Client,
    LoggingOptionsOrDict,
    RawClient,
    RetryOptionsOrDict,
    no_auth,
    param,
)
from .server.server_config import ServerConfigOrDict


class ResolvePayRescueApiClient(BaseResolvePayRescueApiClient[RawClient]):
    def __init__(
        self,
        *,
        server_config: ServerConfigOrDict | None = None,
        timeout: float = DEFAULT_TIMEOUT,
        retry_options: int | RetryOptionsOrDict | None = None,
        logging_options: LoggingOptionsOrDict | None = None,
        custom_http_client: HttpClient | None = None,
        bearer: str | None = None,
    ) -> None:
        super().__init__(
            server_config=server_config, timeout=timeout, retry_options=retry_options, logging_options=logging_options
        )
        self._raw_client = RawClient(
            http_client=custom_http_client if custom_http_client is not None else Httpx2Client(timeout=timeout),
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
        self._auth = AuthSchemes(bearer=BearerAuthScheme(bearer) if bearer is not None else no_auth)

    @cached_property
    def auth_api(self) -> AuthApi:
        return AuthApi(self._raw_client, self._server, self._auth)

    @cached_property
    def cases(self) -> Cases:
        return Cases(self._raw_client, self._server, self._auth)

    @cached_property
    def catalog(self) -> Catalog:
        return Catalog(self._raw_client, self._server, self._auth)

    @cached_property
    def dev(self) -> Dev:
        return Dev(self._raw_client, self._server, self._auth)

    @cached_property
    def merchant(self) -> Merchant:
        return Merchant(self._raw_client, self._server, self._auth)

    @cached_property
    def plans(self) -> Plans:
        return Plans(self._raw_client, self._server, self._auth)

    @cached_property
    def policies(self) -> Policies:
        return Policies(self._raw_client, self._server, self._auth)

    @cached_property
    def resolutions(self) -> Resolutions:
        return Resolutions(self._raw_client, self._server, self._auth)

    @cached_property
    def webhooks(self) -> Webhooks:
        return Webhooks(self._raw_client, self._server, self._auth)

    def close(self) -> None:
        self._raw_client.http_client.close()

    def __enter__(self) -> Self:
        return self

    def __exit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, exc_tb: TracebackType | None
    ) -> None:
        self.close()


Client = ResolvePayRescueApiClient
