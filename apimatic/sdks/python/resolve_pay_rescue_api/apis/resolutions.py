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


class Resolutions:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = ResolutionsWithRawResponse(client, server, auth)

    def resolutions_controller_get_receipt(
        self, case_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Generates an immutable resolution receipt detailing approved remedy, financial refund IDs, return status, and
        double-entry ledger citations.

        Args:
            case_id: Dispute case UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.resolutions_controller_get_receipt(case_id, request_options=request_options)
        )

    def resolutions_controller_get_recovery_queue(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator reconciliation.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.resolutions_controller_get_recovery_queue(request_options=request_options)
        )

    def resolutions_controller_reconcile_operation(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Queries authoritative payment provider state to reconcile pending operations without duplicate disbursements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.resolutions_controller_reconcile_operation(id_, request_options=request_options)
        )

    def resolutions_controller_record_inspection(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Records merchant physical inspection pass/fail status, unlocking or blocking automated resolution fund
        disbursement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.resolutions_controller_record_inspection(id_, request_options=request_options)
        )

    @property
    def with_raw_response(self) -> ResolutionsWithRawResponse:
        return self._with_raw_response


class AsyncResolutions:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncResolutionsWithRawResponse(client, server, auth)

    async def resolutions_controller_get_receipt(
        self, case_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Generates an immutable resolution receipt detailing approved remedy, financial refund IDs, return status, and
        double-entry ledger citations.

        Args:
            case_id: Dispute case UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.resolutions_controller_get_receipt(case_id, request_options=request_options)
        )

    async def resolutions_controller_get_recovery_queue(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator reconciliation.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.resolutions_controller_get_recovery_queue(request_options=request_options)
        )

    async def resolutions_controller_reconcile_operation(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Queries authoritative payment provider state to reconcile pending operations without duplicate disbursements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.resolutions_controller_reconcile_operation(
                id_, request_options=request_options
            ),
        )

    async def resolutions_controller_record_inspection(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Records merchant physical inspection pass/fail status, unlocking or blocking automated resolution fund
        disbursement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.resolutions_controller_record_inspection(id_, request_options=request_options)
        )

    @property
    def with_raw_response(self) -> AsyncResolutionsWithRawResponse:
        return self._with_raw_response


class ResolutionsWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def resolutions_controller_get_receipt(
        self, case_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Generates an immutable resolution receipt detailing approved remedy, financial refund IDs, return status, and
        double-entry ledger citations.

        Args:
            case_id: Dispute case UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{caseId}/receipt"),
            path_params=[param[str]("caseId", case_id)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def resolutions_controller_get_recovery_queue(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator reconciliation.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/merchant/recovery"),
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def resolutions_controller_reconcile_operation(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Queries authoritative payment provider state to reconcile pending operations without duplicate disbursements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/merchant/recovery/{id}/reconcile"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def resolutions_controller_record_inspection(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Records merchant physical inspection pass/fail status, unlocking or blocking automated resolution fund
        disbursement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/returns/{id}/inspection"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncResolutionsWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def resolutions_controller_get_receipt(
        self, case_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Generates an immutable resolution receipt detailing approved remedy, financial refund IDs, return status, and
        double-entry ledger citations.

        Args:
            case_id: Dispute case UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{caseId}/receipt"),
            path_params=[param[str]("caseId", case_id)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def resolutions_controller_get_recovery_queue(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator reconciliation.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/merchant/recovery"),
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def resolutions_controller_reconcile_operation(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Queries authoritative payment provider state to reconcile pending operations without duplicate disbursements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/merchant/recovery/{id}/reconcile"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def resolutions_controller_record_inspection(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Records merchant physical inspection pass/fail status, unlocking or blocking automated resolution fund
        disbursement.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/returns/{id}/inspection"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )
