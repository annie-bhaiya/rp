import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import type { RawClient } from "../core/raw-client.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import type { Servers } from "../servers.js";

/**
 * AI-assisted and policy-guided remedy plan proposals, acceptance, and approval
 */
export class Plans {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Accept Remedy Plan
   *
   * @remarks
   * Records customer consent to a specific remedy proposal bound strictly to its canonical hash.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  plansControllerAcceptPlan(
    request: Plans.PlansControllerAcceptPlanRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/plans/{id}/accept"),
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
   * Approve and Execute Plan
   *
   * @remarks
   * Atomically approves accepted plan and dispatches automated financial refund or inventory
   * replacement.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  plansControllerApproveAndExecute(
    request: Plans.PlansControllerApproveAndExecuteRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/plans/{id}/approve-and-execute"),
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
   * Approve Remedy Plan
   *
   * @remarks
   * Merchant authorization of customer-accepted remedy proposal bound to canonical plan hash.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  plansControllerApprovePlan(
    request: Plans.PlansControllerApprovePlanRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/plans/{id}/approve"),
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
   * Execute Resolution Steps
   *
   * @remarks
   * Executes saga orchestration steps (PayPal refund, replacement order creation, subledger
   * balancing).
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  plansControllerExecutePlan(
    request: Plans.PlansControllerExecutePlanRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/plans/{id}/execute"),
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
   * Generate Remedy Proposals
   *
   * @remarks
   * Evaluates order items and policies to generate SHA-256 hashed remedy proposals (Refund,
   * Replacement, Exchange).
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  plansControllerGenerateProposals(
    request: Plans.PlansControllerGenerateProposalsRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/proposals"),
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
   * List Remedy Plans
   *
   * @remarks
   * Lists all proposed remedy plans with exact monetary calculations and return requirements.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  plansControllerGetPlans(
    request: Plans.PlansControllerGetPlansRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/cases/{id}/plans"),
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
   * Reject Remedy Plan
   *
   * @remarks
   * Rejects a proposed remedy plan and returns the case to manual review.
   *
   * @returns Resource created or action completed successfully
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  plansControllerRejectPlan(
    request: Plans.PlansControllerRejectPlanRequest,
    options?: RequestOptions,
  ): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/api/v1/plans/{id}/reject"),
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

export namespace Plans {
  export type PlansControllerAcceptPlanRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type PlansControllerApproveAndExecuteRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type PlansControllerApprovePlanRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type PlansControllerExecutePlanRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type PlansControllerGenerateProposalsRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type PlansControllerGetPlansRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };

  export type PlansControllerRejectPlanRequest = {
    /** Unique UUID identifier of the target resource */
    id: string;
  };
}
