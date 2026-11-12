from __future__ import annotations

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
    raw_error_response,
    unwrap,
)
from ..server.server import Server


class Merchant:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = MerchantWithRawResponse(client, server, auth)

    def merchant_controller_export_reconciliation_csv(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.merchant_controller_export_reconciliation_csv(request_options=request_options)
        )

    def merchant_controller_get_insights(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Aggregates return rates, common defect categories, and resolution cost analytics.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.merchant_controller_get_insights(request_options=request_options))

    @property
    def with_raw_response(self) -> MerchantWithRawResponse:
        return self._with_raw_response


class AsyncMerchant:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncMerchantWithRawResponse(client, server, auth)

    async def merchant_controller_export_reconciliation_csv(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.merchant_controller_export_reconciliation_csv(request_options=request_options)
        )

    async def merchant_controller_get_insights(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Aggregates return rates, common defect categories, and resolution cost analytics.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.merchant_controller_get_insights(request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncMerchantWithRawResponse:
        return self._with_raw_response


class MerchantWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def merchant_controller_export_reconciliation_csv(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/merchant/reconciliation/export.csv"),
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def merchant_controller_get_insights(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Aggregates return rates, common defect categories, and resolution cost analytics.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/merchant/insights"),
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncMerchantWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def merchant_controller_export_reconciliation_csv(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Exports balanced double-entry journal transactions and account debits/credits in standard CSV format.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/merchant/reconciliation/export.csv"),
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def merchant_controller_get_insights(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Aggregates return rates, common defect categories, and resolution cost analytics.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/merchant/insights"),
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )
