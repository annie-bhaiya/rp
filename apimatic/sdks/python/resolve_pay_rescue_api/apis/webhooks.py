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


class Webhooks:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = WebhooksWithRawResponse(client, server, auth)

    def webhooks_controller_handle_email_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Processes inbound email webhooks for a specific store connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.webhooks_controller_handle_email_connection_webhook(
                connection_key, request_options=request_options
            ),
        )

    def webhooks_controller_handle_email_webhook(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Processes inbound Resend webhook notifications for delivery, bounce, and reply tracking.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.webhooks_controller_handle_email_webhook(request_options=request_options))

    def webhooks_controller_handle_pay_pal_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Processes inbound PayPal webhook events directed to a specific merchant connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.webhooks_controller_handle_pay_pal_connection_webhook(
                connection_key, request_options=request_options
            ),
        )

    def webhooks_controller_handle_pay_pal_webhook(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Processes inbound PayPal payment capture, authorization, and refund events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.webhooks_controller_handle_pay_pal_webhook(request_options=request_options)
        )

    @property
    def with_raw_response(self) -> WebhooksWithRawResponse:
        return self._with_raw_response


class AsyncWebhooks:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncWebhooksWithRawResponse(client, server, auth)

    async def webhooks_controller_handle_email_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Processes inbound email webhooks for a specific store connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.webhooks_controller_handle_email_connection_webhook(
                connection_key, request_options=request_options
            ),
        )

    async def webhooks_controller_handle_email_webhook(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Processes inbound Resend webhook notifications for delivery, bounce, and reply tracking.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.webhooks_controller_handle_email_webhook(request_options=request_options)
        )

    async def webhooks_controller_handle_pay_pal_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Processes inbound PayPal webhook events directed to a specific merchant connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.webhooks_controller_handle_pay_pal_connection_webhook(
                connection_key, request_options=request_options
            ),
        )

    async def webhooks_controller_handle_pay_pal_webhook(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Processes inbound PayPal payment capture, authorization, and refund events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.webhooks_controller_handle_pay_pal_webhook(request_options=request_options)
        )

    @property
    def with_raw_response(self) -> AsyncWebhooksWithRawResponse:
        return self._with_raw_response


class WebhooksWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def webhooks_controller_handle_email_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound email webhooks for a specific store connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/email/{connectionKey}"),
            path_params=[param[str]("connectionKey", connection_key)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def webhooks_controller_handle_email_webhook(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound Resend webhook notifications for delivery, bounce, and reply tracking.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/email"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def webhooks_controller_handle_pay_pal_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound PayPal webhook events directed to a specific merchant connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/paypal/{connectionKey}"),
            path_params=[param[str]("connectionKey", connection_key)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def webhooks_controller_handle_pay_pal_webhook(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound PayPal payment capture, authorization, and refund events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/paypal"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncWebhooksWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def webhooks_controller_handle_email_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound email webhooks for a specific store connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/email/{connectionKey}"),
            path_params=[param[str]("connectionKey", connection_key)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def webhooks_controller_handle_email_webhook(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound Resend webhook notifications for delivery, bounce, and reply tracking.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/email"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def webhooks_controller_handle_pay_pal_connection_webhook(
        self, connection_key: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound PayPal webhook events directed to a specific merchant connection key.

        Args:
            connection_key: Webhook store connection identifier key
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/paypal/{connectionKey}"),
            path_params=[param[str]("connectionKey", connection_key)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def webhooks_controller_handle_pay_pal_webhook(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Processes inbound PayPal payment capture, authorization, and refund events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/webhooks/paypal"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )
