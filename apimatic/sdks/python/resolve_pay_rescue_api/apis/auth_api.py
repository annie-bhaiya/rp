from __future__ import annotations

from uuid import UUID, uuid4

from ..auth import AsyncAuthSchemes, AuthSchemes
from ..core import (
    ApiResult,
    AsyncRawClient,
    RawClient,
    RawError,
    RequestOptionsOrDict,
    SecuredRawResponse,
    async_empty_response,
    empty_response,
    param,
    raw_error_response,
    unwrap,
)
from ..server.server import Server


class AuthApi:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = AuthApiWithRawResponse(client, server, auth)

    def auth_controller_config(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Retrieves current authentication capability flags, including whether 1-click demo persona switching is
        enabled.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_config(request_options=request_options))

    def auth_controller_get_session(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Validates and returns the active session actor, role, tenant, and expiration from the session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_get_session(request_options=request_options))

    def auth_controller_login_dev(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Instantly authenticates as a demo persona (OWNER, APPROVER, JUDGE, or CUSTOMER) when demo mode is active.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_login_dev(request_options=request_options))

    def auth_controller_logout(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Revokes the active session token server-side and clears the resolvepay_session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_logout(request_options=request_options))

    def auth_controller_redeem_access(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Redeems a single-use customer access token, establishing an authenticated session with secure httpOnly
        cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_redeem_access(request_options=request_options))

    def auth_controller_redeem_merchant(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Redeems a merchant login token, verifies active store membership, and establishes an authenticated merchant
        session.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_redeem_merchant(request_options=request_options))

    def auth_controller_request_access(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Generates and delivers a single-use access link for a customer based on normalized order reference and
        customer email.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_request_access(request_options=request_options))

    def auth_controller_request_merchant(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Sends a magic sign-in link to a registered merchant user email for store workspace access.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.auth_controller_request_merchant(request_options=request_options))

    @property
    def with_raw_response(self) -> AuthApiWithRawResponse:
        return self._with_raw_response


class AsyncAuthApi:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncAuthApiWithRawResponse(client, server, auth)

    async def auth_controller_config(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Retrieves current authentication capability flags, including whether 1-click demo persona switching is
        enabled.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_config(request_options=request_options))

    async def auth_controller_get_session(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Validates and returns the active session actor, role, tenant, and expiration from the session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_get_session(request_options=request_options))

    async def auth_controller_login_dev(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Instantly authenticates as a demo persona (OWNER, APPROVER, JUDGE, or CUSTOMER) when demo mode is active.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_login_dev(request_options=request_options))

    async def auth_controller_logout(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Revokes the active session token server-side and clears the resolvepay_session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_logout(request_options=request_options))

    async def auth_controller_redeem_access(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Redeems a single-use customer access token, establishing an authenticated session with secure httpOnly
        cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_redeem_access(request_options=request_options))

    async def auth_controller_redeem_merchant(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Redeems a merchant login token, verifies active store membership, and establishes an authenticated merchant
        session.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_redeem_merchant(request_options=request_options))

    async def auth_controller_request_access(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Generates and delivers a single-use access link for a customer based on normalized order reference and
        customer email.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_request_access(request_options=request_options))

    async def auth_controller_request_merchant(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Sends a magic sign-in link to a registered merchant user email for store workspace access.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.auth_controller_request_merchant(request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncAuthApiWithRawResponse:
        return self._with_raw_response


class AuthApiWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def auth_controller_config(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves current authentication capability flags, including whether 1-click demo persona switching is
        enabled.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/auth/config"),
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def auth_controller_get_session(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Validates and returns the active session actor, role, tenant, and expiration from the session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/auth/session"),
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def auth_controller_login_dev(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Instantly authenticates as a demo persona (OWNER, APPROVER, JUDGE, or CUSTOMER) when demo mode is active.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/login-dev"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def auth_controller_logout(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Revokes the active session token server-side and clears the resolvepay_session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/logout"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def auth_controller_redeem_access(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Redeems a single-use customer access token, establishing an authenticated session with secure httpOnly
        cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/customer/access/redeem"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def auth_controller_redeem_merchant(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Redeems a merchant login token, verifies active store membership, and establishes an authenticated merchant
        session.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/merchant/access/redeem"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def auth_controller_request_access(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Generates and delivers a single-use access link for a customer based on normalized order reference and
        customer email.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/customer/access/request"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def auth_controller_request_merchant(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Sends a magic sign-in link to a registered merchant user email for store workspace access.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/merchant/access/request"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncAuthApiWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def auth_controller_config(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves current authentication capability flags, including whether 1-click demo persona switching is
        enabled.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/auth/config"),
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def auth_controller_get_session(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Validates and returns the active session actor, role, tenant, and expiration from the session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/auth/session"),
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def auth_controller_login_dev(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Instantly authenticates as a demo persona (OWNER, APPROVER, JUDGE, or CUSTOMER) when demo mode is active.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/login-dev"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def auth_controller_logout(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Revokes the active session token server-side and clears the resolvepay_session cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/logout"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def auth_controller_redeem_access(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Redeems a single-use customer access token, establishing an authenticated session with secure httpOnly
        cookie.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/customer/access/redeem"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def auth_controller_redeem_merchant(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Redeems a merchant login token, verifies active store membership, and establishes an authenticated merchant
        session.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/merchant/access/redeem"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def auth_controller_request_access(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Generates and delivers a single-use access link for a customer based on normalized order reference and
        customer email.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/customer/access/request"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def auth_controller_request_merchant(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Sends a magic sign-in link to a registered merchant user email for store workspace access.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/auth/merchant/access/request"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )
