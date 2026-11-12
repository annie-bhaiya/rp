import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import type { RawClient } from "../core/raw-client.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import type { Servers } from "../servers.js";

/**
 * Dispute case creation, messaging timeline, evidence uploads, and completeness checking
 */
export class Cases {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Send Case Message
   *
   * @remarks
   * Appends a verified customer or merchant message to the dispute case timeline.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerAddMessage(
    request: Cases.CasesControllerAddMessageRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/messages"),
        auth: this.#auth.bearer,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Complete Evidence Upload
   *
   * @remarks
   * Marks evidence upload as completed and triggers policy validation checks.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerCompleteEvidenceUpload(
    request: Cases.CasesControllerCompleteEvidenceUploadRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/evidence/{evidenceId}/complete"),
        auth: this.#auth.bearer,
        pathParams: [
          { name: "id", value: request.id, schema: s.string() },
          { name: "evidenceId", value: request.evidenceId, schema: s.string() },
        ],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Create Dispute Case
   *
   * @remarks
   * Opens a new dispute case for an eligible order, creating initial customer complaint timeline
   * events.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerCreateCase(options?: RequestOptions): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/cases"),
        auth: this.#auth.bearer,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Create Evidence Upload Intent
   *
   * @remarks
   * Initializes an evidence upload slot and returns target upload metadata and hash requirements.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerCreateEvidenceIntent(
    request: Cases.CasesControllerCreateEvidenceIntentRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/evidence/upload-intent"),
        auth: this.#auth.bearer,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Get Case Details
   *
   * @remarks
   * Retrieves complete dispute case details, state machine status, and order metadata.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerGetCase(
    request: Cases.CasesControllerGetCaseRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}"),
        auth: this.#auth.bearer,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Assess Evidence Completeness
   *
   * @remarks
   * AI-assisted evaluation of customer complaint narrative against active merchant policy clauses,
   * generating targeted clarification questions.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerGetCompleteness(
    request: Cases.CasesControllerGetCompletenessRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/completeness"),
        auth: this.#auth.bearer,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Download Evidence File
   *
   * @remarks
   * Downloads raw evidence file bytes for authorized merchant inspection.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerGetEvidenceFile(
    request: Cases.CasesControllerGetEvidenceFileRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/evidence/{evidenceId}/file"),
        auth: this.#auth.bearer,
        pathParams: [
          { name: "id", value: request.id, schema: s.string() },
          { name: "evidenceId", value: request.evidenceId, schema: s.string() },
        ],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Get Case Timeline
   *
   * @remarks
   * Returns chronological audit events, messages, policy evaluations, and payment updates for a
   * case.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerGetTimeline(
    request: Cases.CasesControllerGetTimelineRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/timeline"),
        auth: this.#auth.bearer,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * List Dispute Cases
   *
   * @remarks
   * Lists dispute cases scoped to the authenticated customer's order or all store cases for
   * merchants.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerListCases(options?: RequestOptions): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/cases"),
        auth: this.#auth.bearer,
        pathParams: [],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Submit Completeness Answers
   *
   * @remarks
   * Submits customer answers to targeted clarification questions, updating case constraints and
   * re-evaluating remedy proposals.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerSaveCompletenessAnswers(
    request: Cases.CasesControllerSaveCompletenessAnswersRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/completeness/answers"),
        auth: this.#auth.bearer,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }

  /**
   * Upload Evidence File
   *
   * @remarks
   * Uploads binary photo evidence content, calculating SHA-256 hash for tamper-proof audit trails.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  casesControllerUploadEvidenceFile(
    request: Cases.CasesControllerUploadEvidenceFileRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/evidence/{evidenceId}/upload"),
        auth: this.#auth.bearer,
        pathParams: [
          { name: "id", value: request.id, schema: s.string() },
          { name: "evidenceId", value: request.evidenceId, schema: s.string() },
        ],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "empty" },
        errorFactory: ApiError,
      },
      options,
    );
  }
}

export namespace Cases {
  export type CasesControllerAddMessageRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type CasesControllerCompleteEvidenceUploadRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
    /** Evidence item UUID identifier */
    evidenceId: string;
  };

  export type CasesControllerCreateEvidenceIntentRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type CasesControllerGetCaseRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type CasesControllerGetCompletenessRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type CasesControllerGetEvidenceFileRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
    /** Evidence item UUID identifier */
    evidenceId: string;
  };

  export type CasesControllerGetTimelineRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type CasesControllerSaveCompletenessAnswersRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type CasesControllerUploadEvidenceFileRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
    /** Evidence item UUID identifier */
    evidenceId: string;
  };
}
