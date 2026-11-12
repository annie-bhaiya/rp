# APIMatic Integration & Developer Hub Guide

ResolvePay Rescue uses [APIMatic](https://www.apimatic.io/) to power a unified developer platform: production-grade client SDKs across three languages, an interactive 54-page Developer Documentation Portal with an API playground, and an AI Context Plugin that equips modern AI coding assistants (Claude Code, Cursor, Copilot, Antigravity) with deep domain knowledge of ResolvePay's state machines and APIs.

---

## 1. Generated Artifacts Overview

All artifacts are generated deterministically from the canonical OpenAPI specification in [`apimatic/src/spec/openapi.json`](file:///e:/ResolvePay/apimatic/src/spec/openapi.json):

| Artifact | Language / Type | Output Location | Description |
| :--- | :--- | :--- | :--- |
| **TypeScript SDK** | TypeScript / Node.js / Browser | [`apimatic/sdks/typescript/`](file:///e:/ResolvePay/apimatic/sdks/typescript/) | Fully typed client library with ESM/CJS dual-build, auth, retries, and models |
| **Python SDK** | Python 3.8+ | [`apimatic/sdks/python/`](file:///e:/ResolvePay/apimatic/sdks/python/) | Pydantic-powered, strongly-typed Python client package with docstrings |
| **C# / .NET SDK** | .NET 8 / C# 12 | [`apimatic/sdks/csharp/`](file:///e:/ResolvePay/apimatic/sdks/csharp/) | Async-first .NET library with nullable reference types and HTTP resilience |
| **Developer Portal** | Static Site (54 pages) | [`apimatic/portal/`](file:///e:/ResolvePay/apimatic/portal/) | Interactive documentation portal with API playground, SDK guides, and `llms.txt` |
| **AI Context Plugin** | AI Assistant Skills | [`apimatic/plugin/`](file:///e:/ResolvePay/apimatic/plugin/) | Claude, Cursor, and Codex skills teaching AI models how to integrate ResolvePay |

---

## 2. Official Multi-Language SDKs

### TypeScript / Node.js SDK
- **Location**: [`apimatic/sdks/typescript/`](file:///e:/ResolvePay/apimatic/sdks/typescript/)
- **Features**: Dual ESM and CommonJS distributions, automatic Bearer token injection, SDK map index (`sdk-map.md`), and comprehensive model validation.
- **Quickstart**:
  ```typescript
  import { ResolvePayRescueApiClient } from "resolve-pay-rescue-api";

  const client = new ResolvePayRescueApiClient({
    bearer: process.env.RESOLVEPAY_API_TOKEN,
  });

  // Fetch dispute cases
  const cases = await client.cases.listCases();
  console.log(`Active disputes: ${cases.length}`);

  // Fetch completeness diagnostic
  const completeness = await client.cases.getCaseCompleteness(cases[0].id);
  console.log(`Score: ${completeness.completenessScore}%`);
  ```

### Python SDK
- **Location**: [`apimatic/sdks/python/`](file:///e:/ResolvePay/apimatic/sdks/python/)
- **Features**: Modern type annotations, automated HTTP connection pooling, retry exponential backoff, and full support for asynchronous or synchronous execution.
- **Quickstart**:
  ```python
  from resolvepay_rescue_api import ResolvePayRescueApiClient

  client = ResolvePayRescueApiClient(bearer="YOUR_API_TOKEN")

  # Query merchant recovery statistics
  metrics = client.merchant.getMerchantRecoveryMetrics()
  print(f"Salvaged Volume: ${metrics.salvaged_volume_usd}")
  ```

### C# / .NET SDK
- **Location**: [`apimatic/sdks/csharp/`](file:///e:/ResolvePay/apimatic/sdks/csharp/)
- **Features**: Asynchronous pattern (`Task<T>`), dependency injection friendly, structured exception hierarchies inheriting from `ApiException`.
- **Quickstart**:
  ```csharp
  using ResolvePayRescueApi;

  var client = new ResolvePayRescueApiClient(bearer: "YOUR_API_TOKEN");

  var policies = await client.Policies.GetMerchantPoliciesAsync();
  Console.WriteLine($"Active policy tier: {policies.ActiveVersion}");
  ```

---

## 3. Interactive Developer Documentation Portal

The documentation portal was generated using `apimatic portal generate` and includes 54 fully rendered static pages styled in accordance with ResolvePay's brand tokens:
- **Theme**: Canvas (`#F8FAFC`), Trust Blue (`#1E40AF`), Focus (`#2563EB`).
- **Features**:
  - Live API Reference with request/response schemas for all 45 routes across 9 controllers.
  - Interactive API Playground with authentication token testing.
  - LLM-ready context files: [`apimatic/portal/llms.txt`](file:///e:/ResolvePay/apimatic/portal/llms.txt) and [`apimatic/portal/llms-full.txt`](file:///e:/ResolvePay/apimatic/portal/llms-full.txt).
  - SDK installation cards with tabbed multi-language code snippets.

### Running the Portal Locally
To preview the documentation portal with live reload:
```bash
apimatic portal serve -i apimatic
```
Or serve the static files in [`apimatic/portal`](file:///e:/ResolvePay/apimatic/portal) directly with any static server:
```bash
npx serve apimatic/portal
```

---

## 4. AI Context Plugin

The generated AI Context Plugin in [`apimatic/plugin`](file:///e:/ResolvePay/apimatic/plugin) enables modern AI coding assistants to write idiomatic ResolvePay integrations without hallucinating parameter names or workflow transitions:
- **Supported Assistants**:
  - **Claude Code**: [`.claude-plugin/plugin.json`](file:///e:/ResolvePay/apimatic/plugin/.claude-plugin/plugin.json)
  - **Cursor**: [`.cursor-plugin/plugin.json`](file:///e:/ResolvePay/apimatic/plugin/.cursor-plugin/plugin.json)
  - **OpenAI Codex / ChatGPT**: [`.codex-plugin/plugin.json`](file:///e:/ResolvePay/apimatic/plugin/.codex-plugin/plugin.json)
  - **Autonomous Agents**: [`scoped/agents/resolve-pay-rescue-api-planner.md`](file:///e:/ResolvePay/apimatic/plugin/scoped/agents/resolve-pay-rescue-api-planner.md)
- **Specialized Skills Included**:
  - Authentication, Client Initialization, Calling Endpoints, Configuration & Resilience, Error Handling, Event Streams, File & Evidence Handling, Models Reference, and Unit Testing.
- **Installation for Coding Agents**:
  ```bash
  npx context-plugins install "./apimatic/plugin"
  ```

---

## 5. Automation & Continuous Synchronization

Whenever backend API routes, DTOs, or policies change, run the unified synchronization script:

```bash
pnpm apimatic:all
```

This single command automatically:
1. Re-exports the enriched OpenAPI schema (`pnpm openapi:export`).
2. Validates the schema against APIMatic rules (`pnpm apimatic:validate`).
3. Re-generates the static Developer Portal (`pnpm apimatic:portal`).
4. Re-generates TypeScript, Python, and C# SDKs (`pnpm apimatic:sdks`).
5. Re-generates the AI Context Plugin (`pnpm apimatic:plugin`).

