import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import type { RawClient } from "../core/raw-client.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import type { Servers } from "../servers.js";

/**
 * Physical return inspection gating, receipt generation, and resolution orchestration
 */
export class Resolutions {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Get Resolution Receipt
   *
   * @remarks
   * Generates an immutable resolution receipt detailing approved remedy, financial refund IDs,
   * return status, and double-entry ledger citations.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  resolutionsControllerGetReceipt(
    request: Resolutions.ResolutionsControllerGetReceiptRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/cases/{caseId}/receipt"),
        auth: this.#auth.bearer,
        pathParams: [{ name: "caseId", value: request.caseId, schema: s.string() }],
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
   * List Operator Recovery Queue
   *
   * @remarks
   * Lists saga resolution steps marked UNKNOWN or failed due to provider drops, awaiting operator
   * reconciliation.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  resolutionsControllerGetRecoveryQueue(options?: RequestOptions): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/merchant/recovery"),
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
   * Reconcile Step State
   *
   * @remarks
   * Queries authoritative payment provider state to reconcile pending operations without duplicate
   * disbursements.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  resolutionsControllerReconcileOperation(
    request: Resolutions.ResolutionsControllerReconcileOperationRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/merchant/recovery/{id}/reconcile"),
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
   * Record Return Inspection
   *
   * @remarks
   * Records merchant physical inspection pass/fail status, unlocking or blocking automated
   * resolution fund disbursement.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  resolutionsControllerRecordInspection(
    request: Resolutions.ResolutionsControllerRecordInspectionRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/returns/{id}/inspection"),
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
}

export namespace Resolutions {
  export type ResolutionsControllerGetReceiptRequest = {
    /** Dispute case UUID identifier */
    caseId: string;
  };

  export type ResolutionsControllerReconcileOperationRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type ResolutionsControllerRecordInspectionRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };
}
