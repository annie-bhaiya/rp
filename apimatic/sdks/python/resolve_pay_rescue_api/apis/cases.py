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


class Cases:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = CasesWithRawResponse(client, server, auth)

    def cases_controller_add_message(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Appends a verified customer or merchant message to the dispute case timeline.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.cases_controller_add_message(id_, request_options=request_options))

    def cases_controller_complete_evidence_upload(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Marks evidence upload as completed and triggers policy validation checks.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.cases_controller_complete_evidence_upload(
                id_, evidence_id, request_options=request_options
            ),
        )

    def cases_controller_create_case(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Opens a new dispute case for an eligible order, creating initial customer complaint timeline events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.cases_controller_create_case(request_options=request_options))

    def cases_controller_create_evidence_intent(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Initializes an evidence upload slot and returns target upload metadata and hash requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.cases_controller_create_evidence_intent(id_, request_options=request_options)
        )

    def cases_controller_get_case(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Retrieves complete dispute case details, state machine status, and order metadata.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.cases_controller_get_case(id_, request_options=request_options))

    def cases_controller_get_completeness(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """AI-assisted evaluation of customer complaint narrative against active merchant policy clauses, generating
        targeted clarification questions.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.cases_controller_get_completeness(id_, request_options=request_options))

    def cases_controller_get_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Downloads raw evidence file bytes for authorized merchant inspection.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.cases_controller_get_evidence_file(
                id_, evidence_id, request_options=request_options
            ),
        )

    def cases_controller_get_timeline(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Returns chronological audit events, messages, policy evaluations, and payment updates for a case.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.cases_controller_get_timeline(id_, request_options=request_options))

    def cases_controller_list_cases(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Lists dispute cases scoped to the authenticated customer's order or all store cases for merchants.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.cases_controller_list_cases(request_options=request_options))

    def cases_controller_save_completeness_answers(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Submits customer answers to targeted clarification questions, updating case constraints and re-evaluating
        remedy proposals.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.cases_controller_save_completeness_answers(id_, request_options=request_options)
        )

    def cases_controller_upload_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            self._with_raw_response.cases_controller_upload_evidence_file(
                id_, evidence_id, request_options=request_options
            ),
        )

    @property
    def with_raw_response(self) -> CasesWithRawResponse:
        return self._with_raw_response


class AsyncCases:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncCasesWithRawResponse(client, server, auth)

    async def cases_controller_add_message(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Appends a verified customer or merchant message to the dispute case timeline.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.cases_controller_add_message(id_, request_options=request_options))

    async def cases_controller_complete_evidence_upload(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Marks evidence upload as completed and triggers policy validation checks.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.cases_controller_complete_evidence_upload(
                id_, evidence_id, request_options=request_options
            ),
        )

    async def cases_controller_create_case(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Opens a new dispute case for an eligible order, creating initial customer complaint timeline events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.cases_controller_create_case(request_options=request_options))

    async def cases_controller_create_evidence_intent(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Initializes an evidence upload slot and returns target upload metadata and hash requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.cases_controller_create_evidence_intent(id_, request_options=request_options)
        )

    async def cases_controller_get_case(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Retrieves complete dispute case details, state machine status, and order metadata.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.cases_controller_get_case(id_, request_options=request_options))

    async def cases_controller_get_completeness(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """AI-assisted evaluation of customer complaint narrative against active merchant policy clauses, generating
        targeted clarification questions.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.cases_controller_get_completeness(id_, request_options=request_options)
        )

    async def cases_controller_get_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Downloads raw evidence file bytes for authorized merchant inspection.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.cases_controller_get_evidence_file(
                id_, evidence_id, request_options=request_options
            ),
        )

    async def cases_controller_get_timeline(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Returns chronological audit events, messages, policy evaluations, and payment updates for a case.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.cases_controller_get_timeline(id_, request_options=request_options))

    async def cases_controller_list_cases(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Lists dispute cases scoped to the authenticated customer's order or all store cases for merchants.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Successful response

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.cases_controller_list_cases(request_options=request_options))

    async def cases_controller_save_completeness_answers(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Submits customer answers to targeted clarification questions, updating case constraints and re-evaluating
        remedy proposals.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.cases_controller_save_completeness_answers(
                id_, request_options=request_options
            ),
        )

    async def cases_controller_upload_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> None:
        """Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            Resource created or action completed successfully

        Raises:
            ApiError: If the API responds with an error status code. ``error`` is ``RawError``."""
        return unwrap(
            await self._with_raw_response.cases_controller_upload_evidence_file(
                id_, evidence_id, request_options=request_options
            ),
        )

    @property
    def with_raw_response(self) -> AsyncCasesWithRawResponse:
        return self._with_raw_response


class CasesWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def cases_controller_add_message(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Appends a verified customer or merchant message to the dispute case timeline.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/messages"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_complete_evidence_upload(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Marks evidence upload as completed and triggers policy validation checks.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/{evidenceId}/complete"),
            path_params=[param[str]("id", id_), param[str]("evidenceId", evidence_id)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_create_case(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Opens a new dispute case for an eligible order, creating initial customer complaint timeline events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_create_evidence_intent(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Initializes an evidence upload slot and returns target upload metadata and hash requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/upload-intent"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_get_case(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves complete dispute case details, state machine status, and order metadata.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_get_completeness(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """AI-assisted evaluation of customer complaint narrative against active merchant policy clauses, generating
        targeted clarification questions.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/completeness"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_get_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Downloads raw evidence file bytes for authorized merchant inspection.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/{evidenceId}/file"),
            path_params=[param[str]("id", id_), param[str]("evidenceId", evidence_id)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_get_timeline(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Returns chronological audit events, messages, policy evaluations, and payment updates for a case.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/timeline"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_list_cases(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Lists dispute cases scoped to the authenticated customer's order or all store cases for merchants.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases"),
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_save_completeness_answers(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Submits customer answers to targeted clarification questions, updating case constraints and re-evaluating
        remedy proposals.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/completeness/answers"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    def cases_controller_upload_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/{evidenceId}/upload"),
            path_params=[param[str]("id", id_), param[str]("evidenceId", evidence_id)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )


class AsyncCasesWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def cases_controller_add_message(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Appends a verified customer or merchant message to the dispute case timeline.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/messages"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_complete_evidence_upload(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Marks evidence upload as completed and triggers policy validation checks.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/{evidenceId}/complete"),
            path_params=[param[str]("id", id_), param[str]("evidenceId", evidence_id)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_create_case(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Opens a new dispute case for an eligible order, creating initial customer complaint timeline events.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_create_evidence_intent(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Initializes an evidence upload slot and returns target upload metadata and hash requirements.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/upload-intent"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_get_case(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Retrieves complete dispute case details, state machine status, and order metadata.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_get_completeness(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """AI-assisted evaluation of customer complaint narrative against active merchant policy clauses, generating
        targeted clarification questions.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/completeness"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_get_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Downloads raw evidence file bytes for authorized merchant inspection.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/{evidenceId}/file"),
            path_params=[param[str]("id", id_), param[str]("evidenceId", evidence_id)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_get_timeline(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Returns chronological audit events, messages, policy evaluations, and payment updates for a case.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases/{id}/timeline"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_list_cases(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Lists dispute cases scoped to the authenticated customer's order or all store cases for merchants.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/v1/cases"),
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_save_completeness_answers(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Submits customer answers to targeted clarification questions, updating case constraints and re-evaluating
        remedy proposals.

        Args:
            id_: Unique UUID identifier of the target resource
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/completeness/answers"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )

    async def cases_controller_upload_evidence_file(
        self, id_: str, evidence_id: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, RawError]:
        """Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.

        Args:
            id_: Unique UUID identifier of the target resource
            evidence_id: Evidence item UUID identifier
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/v1/cases/{id}/evidence/{evidenceId}/upload"),
            path_params=[param[str]("id", id_), param[str]("evidenceId", evidence_id)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.bearer,
            decoder=async_empty_response,
            error_mapper=raw_error_response,
            request_options=request_options,
        )
