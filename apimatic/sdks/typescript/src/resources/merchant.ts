import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import type { RawClient } from "../core/raw-client.js";
import type { Servers } from "../servers.js";

/**
 * Operational recovery queue, policy publishing, analytics insights, and subledger reconciliation
 */
export class Merchant {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Export Subledger CSV
   *
   * @remarks
   * Exports balanced double-entry journal transactions and account debits/credits in standard CSV
   * format.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  merchantControllerExportReconciliationCsv(options?: RequestOptions): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/merchant/reconciliation/export.csv"),
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
   * Get Dispute Insights
   *
   * @remarks
   * Aggregates return rates, common defect categories, and resolution cost analytics.
   *
   * @returns Successful response
   *
   * @throws {@link ApiError} when the API answers with an error status
   *
   * @throws {@link ResolvePayRescueApiError} when no usable response was produced: a connection
   * failure, a timeout, a body that would not decode, a value that would not encode, or a
   * credential that could not be obtained
   */
  merchantControllerGetInsights(options?: RequestOptions): ApiPromise<undefined, ApiError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/api/v1/merchant/insights"),
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
}
