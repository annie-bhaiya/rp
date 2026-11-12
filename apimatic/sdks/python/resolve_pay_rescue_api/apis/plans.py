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


class Plans:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = PlansWithRawResponse(client, server, auth)

    def plans_controller_accept_plan(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Records customer consent to a specific remedy proposal bound strictly to its canonical hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.plans_controller_accept_plan(id_, request_options=request_options))

    def plans_controller_approve_and_execute(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Atomically approves accepted plan and dispatches automated financial refund or inventory replacement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.plans_controller_approve_and_execute(id_, request_options=request_options)
        )

    def plans_controller_approve_plan(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.plans_controller_approve_plan(id_, request_options=request_options))

    def plans_controller_execute_plan(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Executes saga orchestration steps (PayPal refund, replacement order creation, subledger balancing).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.plans_controller_execute_plan(id_, request_options=request_options))

    def plans_controller_generate_proposals(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund, Replacement,
        Exchange).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.plans_controller_generate_proposals(id_, request_options=request_options))

    def plans_controller_get_plans(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Lists all proposed remedy plans with exact monetary calculations and return requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.plans_controller_get_plans(id_, request_options=request_options))

    def plans_controller_reject_plan(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Rejects a proposed remedy plan and returns the case to manual review.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.plans_controller_reject_plan(id_, request_options=request_options))

    @property
    def with_raw_response(self) -> PlansWithRawResponse:
        return self._with_raw_response


class AsyncPlans:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncPlansWithRawResponse(client, server, auth)

    async def plans_controller_accept_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Records customer consent to a specific remedy proposal bound strictly to its canonical hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.plans_controller_accept_plan(id_, request_options=request_options))

    async def plans_controller_approve_and_execute(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Atomically approves accepted plan and dispatches automated financial refund or inventory replacement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.plans_controller_approve_and_execute(id_, request_options=request_options)
        )

    async def plans_controller_approve_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.plans_controller_approve_plan(id_, request_options=request_options))

    async def plans_controller_execute_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Executes saga orchestration steps (PayPal refund, replacement order creation, subledger balancing).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.plans_controller_execute_plan(id_, request_options=request_options))

    async def plans_controller_generate_proposals(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund, Replacement,
        Exchange).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.plans_controller_generate_proposals(id_, request_options=request_options)
        )

    async def plans_controller_get_plans(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Lists all proposed remedy plans with exact monetary calculations and return requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.plans_controller_get_plans(id_, request_options=request_options))

    async def plans_controller_reject_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Rejects a proposed remedy plan and returns the case to manual review.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.plans_controller_reject_plan(id_, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncPlansWithRawResponse:
        return self._with_raw_response


class PlansWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def plans_controller_accept_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Records customer consent to a specific remedy proposal bound strictly to its canonical hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/accept"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def plans_controller_approve_and_execute(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Atomically approves accepted plan and dispatches automated financial refund or inventory replacement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/approve-and-execute"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def plans_controller_approve_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/approve"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def plans_controller_execute_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Executes saga orchestration steps (PayPal refund, replacement order creation, subledger balancing).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/execute"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def plans_controller_generate_proposals(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund, Replacement,
        Exchange).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/proposals"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def plans_controller_get_plans(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Lists all proposed remedy plans with exact monetary calculations and return requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/plans"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def plans_controller_reject_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Rejects a proposed remedy plan and returns the case to manual review.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/reject"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncPlansWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def plans_controller_accept_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Records customer consent to a specific remedy proposal bound strictly to its canonical hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/accept"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def plans_controller_approve_and_execute(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Atomically approves accepted plan and dispatches automated financial refund or inventory replacement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/approve-and-execute"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def plans_controller_approve_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/approve"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def plans_controller_execute_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Executes saga orchestration steps (PayPal refund, replacement order creation, subledger balancing).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/execute"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def plans_controller_generate_proposals(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund, Replacement,
        Exchange).

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/proposals"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def plans_controller_get_plans(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Lists all proposed remedy plans with exact monetary calculations and return requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/plans"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def plans_controller_reject_plan(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Rejects a proposed remedy plan and returns the case to manual review.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/plans/{id}/reject"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )
