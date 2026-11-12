import { buildAuthSchemes, type AuthSchemes } from "./auth-schemes.js";
import type { ClientOptions } from "./client-options.js";
import { buildCoreClientOptions } from "./core/client-options.js";
import { RawClient } from "./core/raw-client.js";
import * as host from "./core/runtime-environment.js";
import * as s from "./core/validation/index.js";
import { Auth } from "./resources/auth.js";
import { Cases } from "./resources/cases.js";
import { Catalog } from "./resources/catalog.js";
import { Dev } from "./resources/dev.js";
import { Merchant } from "./resources/merchant.js";
import { Plans } from "./resources/plans.js";
import { Policies } from "./resources/policies.js";
import { Resolutions } from "./resources/resolutions.js";
import { Webhooks } from "./resources/webhooks.js";
import { buildServers, type Servers } from "./servers.js";

/**
 * Autonomous commerce dispute, policy planning, and remedy resolution engine
 */
export class ResolvePayRescueApiClient {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;
  #auth2?: Auth;
  #catalog?: Catalog;
  #cases?: Cases;
  #plans?: Plans;
  #dev?: Dev;
  #webhooks?: Webhooks;
  #resolutions?: Resolutions;
  #policies?: Policies;
  #merchant?: Merchant;

  constructor(options: ClientOptions = {}) {
    this.#rawClient = new RawClient({
      ...buildCoreClientOptions(options, "RESOLVE_PAY_RESCUE_API_CLIENT_LOG"),
      defaultHeaders: [
        { name: "User-Agent", value: "ResolvePayRescueApiClient/1.0.0 TypeScript", schema: s.string() },
        { name: "X-APIMatic-Lang", value: "TypeScript", schema: s.string() },
        { name: "X-APIMatic-Package-Version", value: "1.0.0", schema: s.string() },
        { name: "X-APIMatic-Gen-Version", value: "4.0.0", schema: s.string() },
        { name: "X-APIMatic-OS", value: host.operatingSystem(), schema: s.optional(s.string()) },
        { name: "X-APIMatic-Runtime", value: host.runtimeDescription(), schema: s.optional(s.string()) },
      ],
      defaultQuery: [],
      defaultPathParams: [],
    });

    this.#servers = buildServers(options);

    this.#auth = buildAuthSchemes(options);
  }

  /**
   * Session management, persona authentication, and magic link access
   */
  get auth2(): Auth {
    return (this.#auth2 ??= new Auth(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Store catalog, product variants, and checkout order lifecycle
   */
  get catalog(): Catalog {
    return (this.#catalog ??= new Catalog(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Dispute case creation, messaging timeline, evidence uploads, and completeness checking
   */
  get cases(): Cases {
    return (this.#cases ??= new Cases(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * AI-assisted and policy-guided remedy plan proposals, acceptance, and approval
   */
  get plans(): Plans {
    return (this.#plans ??= new Plans(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Development mailbox, health checks, seed fixtures, and failure injection simulator
   */
  get dev(): Dev {
    return (this.#dev ??= new Dev(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * PayPal Orders v2 and Resend inbound event processing
   */
  get webhooks(): Webhooks {
    return (this.#webhooks ??= new Webhooks(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Physical return inspection gating, receipt generation, and resolution orchestration
   */
  get resolutions(): Resolutions {
    return (this.#resolutions ??= new Resolutions(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Merchant policy versioning and structured rule management
   */
  get policies(): Policies {
    return (this.#policies ??= new Policies(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Operational recovery queue, policy publishing, analytics insights, and subledger reconciliation
   */
  get merchant(): Merchant {
    return (this.#merchant ??= new Merchant(this.#rawClient, this.#servers, this.#auth));
  }
}
