import type { TokenProvider } from "./core/auth/credentials.js";
import type { CoreClientOptions } from "./core/client-options.js";

export type ClientOptions = SdkClientOptions & CoreClientOptions;

type SdkClientOptions = ServerOptions & {
  /** Session bearer token or authorization credential */
  readonly bearer?: TokenProvider | undefined;
};

type ServerOptions = {
  readonly serverOptions?: {
    default?: {
      baseUrl?: string;
      /** @default "www.example.com" */
      defaultHost?: string;
    };
    default1?: {
      baseUrl?: string;
    };
  };
};
