import type { ClientOptions } from "./client-options.js";
import type { ServerBase, UrlTemplate } from "./core/api-request.js";
import { resolveBaseUrl } from "./core/url.js";
import * as s from "./core/validation/index.js";

export type Servers = {
  default: (subPath: string) => UrlTemplate;
  default1: (subPath: string) => UrlTemplate;
};

const serverSchemas = {
  default: {
    baseUrl: s.of(s.defaulted(s.string(), "https://{defaultHost}")),
    defaultHost: s.of(s.defaulted(s.string(), "www.example.com")),
  },
  default1: {
    baseUrl: s.of(
      s.defaulted(
        s.string(),
        "https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io",
      ),
    ),
  },
};

export function buildServers(options: ClientOptions): Servers {
  const base = {
    default: resolveBaseUrl(defaultServer(options)),
    default1: resolveBaseUrl(default1Server(options)),
  };
  return {
    default: (subPath) => ({ baseUrl: base.default, subPath }),
    default1: (subPath) => ({ baseUrl: base.default1, subPath }),
  };
}

function defaultServer(options: ClientOptions): ServerBase {
  return {
    baseUrl: serverSchemas.default.baseUrl.decode(options.serverOptions?.default?.baseUrl),
    variables: {
      defaultHost: serverSchemas.default.defaultHost.decode(options.serverOptions?.default?.defaultHost),
    },
  };
}

function default1Server(options: ClientOptions): ServerBase {
  return { baseUrl: serverSchemas.default1.baseUrl.decode(options.serverOptions?.default1?.baseUrl) };
}
