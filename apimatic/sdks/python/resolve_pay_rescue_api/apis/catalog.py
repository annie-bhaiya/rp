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


class Catalog:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = CatalogWithRawResponse(client, server, auth)

    def catalog_controller_capture_checkout_order(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Captures authorized funds for a checkout order and records initial double-entry subledger clearing entries.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.catalog_controller_capture_checkout_order(id_, request_options=request_options)
        )

    def catalog_controller_create_checkout_order(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Initializes a purchase order with line items, calculating subtotal, tax, and total minor currency amounts.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.catalog_controller_create_checkout_order(request_options=request_options))

    def catalog_controller_get_catalog(
        self, tenant_slug: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Retrieves active products, product variants, pricing, and available inventory for a merchant store.

        Args:
            tenant_slug: Unique merchant store identifier slug
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.catalog_controller_get_catalog(tenant_slug, request_options=request_options)
        )

    def catalog_controller_get_order(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Retrieves detailed order information including line items, capture IDs, and financial totals for an
        authorized order.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.catalog_controller_get_order(id_, request_options=request_options))

    @property
    def with_raw_response(self) -> CatalogWithRawResponse:
        return self._with_raw_response


class AsyncCatalog:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncCatalogWithRawResponse(client, server, auth)

    async def catalog_controller_capture_checkout_order(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Captures authorized funds for a checkout order and records initial double-entry subledger clearing entries.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.catalog_controller_capture_checkout_order(
                id_, request_options=request_options
            ),
        )

    async def catalog_controller_create_checkout_order(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Initializes a purchase order with line items, calculating subtotal, tax, and total minor currency amounts.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.catalog_controller_create_checkout_order(request_options=request_options)
        )

    async def catalog_controller_get_catalog(
        self, tenant_slug: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Retrieves active products, product variants, pricing, and available inventory for a merchant store.

        Args:
            tenant_slug: Unique merchant store identifier slug
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.catalog_controller_get_catalog(tenant_slug, request_options=request_options)
        )

    async def catalog_controller_get_order(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Retrieves detailed order information including line items, capture IDs, and financial totals for an
        authorized order.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.catalog_controller_get_order(id_, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncCatalogWithRawResponse:
        return self._with_raw_response


class CatalogWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def catalog_controller_capture_checkout_order(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Captures authorized funds for a checkout order and records initial double-entry subledger clearing entries.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/checkout/orders/{id}/capture"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def catalog_controller_create_checkout_order(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Initializes a purchase order with line items, calculating subtotal, tax, and total minor currency amounts.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/checkout/orders"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def catalog_controller_get_catalog(
        self, tenant_slug: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves active products, product variants, pricing, and available inventory for a merchant store.

        Args:
            tenant_slug: Unique merchant store identifier slug
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/catalog"),
            query_params=[param[str]("tenantSlug", tenant_slug)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def catalog_controller_get_order(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves detailed order information including line items, capture IDs, and financial totals for an
        authorized order.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/orders/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncCatalogWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def catalog_controller_capture_checkout_order(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Captures authorized funds for a checkout order and records initial double-entry subledger clearing entries.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/checkout/orders/{id}/capture"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def catalog_controller_create_checkout_order(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Initializes a purchase order with line items, calculating subtotal, tax, and total minor currency amounts.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/checkout/orders"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def catalog_controller_get_catalog(
        self, tenant_slug: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves active products, product variants, pricing, and available inventory for a merchant store.

        Args:
            tenant_slug: Unique merchant store identifier slug
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/catalog"),
            query_params=[param[str]("tenantSlug", tenant_slug)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def catalog_controller_get_order(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves detailed order information including line items, capture IDs, and financial totals for an
        authorized order.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/orders/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )
