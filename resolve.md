# ResolvePay — Operations Guide & Action Items (resolve.md)

This file documents the live cloud environment, explains all resolved errors and root causes, and details all third-party webhook and sandbox configurations.

---

## 🌟 Live Azure Deployment Endpoints (ACTIVE & HEALTHY)

Both the **Frontend Web App** and **Backend REST API** are running live on Azure Container Apps:

* **Customer & Merchant Web App**:
  👉 **[https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io](https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io)**
  - **Storefront & Catalog**: `/`
  - **WhatsApp Live Simulator & Dev Comms Hub**: `/mailbox`
  - **Customer Self-Service Portal**: `/portal` (or `/portal/orders/<orderId>`)
  - **Merchant Command Center & Intelligence**: `/merchant`

* **Backend REST API**:
  👉 **[https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io](https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io)**
  - Health probe: `/api/v1/health`
  - Catalog: `/api/v1/catalog?tenantSlug=default-merchant`
  - Webhooks: `/api/v1/webhooks/*`
  - Dev Comms API: `/api/v1/dev/whatsapp`

* **Cloud Infrastructure**:
  - **Resource Group**: `rg-resolvepay-centralindia` (Region: Central India)
  - **Container Apps Environment**: `cae-resolvepay`
  - **Azure Container Registry**: `crresolvepay.azurecr.io`
    - API Image: `crresolvepay.azurecr.io/resolvepay-api:v6` (Status: Healthy, 1 replica)
    - Web Image: `crresolvepay.azurecr.io/resolvepay-web:v5` (Status: Healthy, 1 replica)
  - **Database**: Cloud Supabase PostgreSQL 17 (`ap-south-1` Mumbai)

---

## 📱 Meta WhatsApp Policy Requirements & Live Alternative

### Why Meta Shows "business doesn't meet WhatsApp's policy requirements"
When attempting to set up a WhatsApp Business Account (WABA) or provision a live phone number in Meta's Developer Dashboard, you received:
> *"You can't complete the setup process because your business doesn't meet WhatsApp's policy requirements. If you think this is incorrect, reach out to your Business Solution Provider for help."*

* **Root Cause**:
  To protect against spam and fraud, Meta requires formal **Business Verification** for any Meta Business Portfolio that provisions WhatsApp Business Accounts. If a developer account is registered under a personal profile or an unverified business organization without official legal incorporation documents (e.g. GSTIN, Certificate of Incorporation, or utility bills), Meta blocks account creation with this policy warning.

* **What Is Required If You Want Real SIM-to-SIM WhatsApp in the Future**:
  1. Open [Meta Business Settings](https://business.facebook.com/settings/info).
  2. Complete **Business Verification** by uploading legal entity documents and verifying domain ownership.
  3. Alternatively, connect through an authorized WhatsApp Business Solution Provider (BSP) such as Twilio or 360dialog.

---

### 🚀 Live Interactive WhatsApp Webhook Simulator (Now Available!)

In accordance with our architecture guidelines, we have implemented an **Interactive WhatsApp Webhook Simulator & Payload Inspector** directly within the live web application at:

👉 **[https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io/mailbox](https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io/mailbox)**

#### How It Works:
1. **Identical Production Pipeline**:
   The simulator constructs the exact Meta WhatsApp Cloud API v21.0 JSON payload that Meta servers dispatch.
2. **Signature & Persistence**:
   The webhook passes through HMAC-SHA256 signature verification, inserts the audit record into the Supabase Cloud PostgreSQL `webhook_inbox` table, and transitions state to `RECEIVED`.
3. **Automated Response Dispatch**:
   The backend bot processes the complaint, maps the customer phone number (`+91 9068662279`), and generates an automated resolution message containing a direct link to the Customer Resolution Portal.
4. **Live Inspection**:
   You can view the full smartphone chat conversation with WhatsApp-styled bubbles, delivery receipts, and an expandable JSON inspector showing the raw webhook event.

---

## 🔍 Other Root Causes & Fixes Implemented

### 1. PayPal "Internal Server Error" on Buy
* **Root Cause 1 (`ORDER_NOT_APPROVED` 422)**:
  In PayPal REST API v2, creating an order with `intent: CAPTURE` generates an unapproved order with HATEOAS approval links. The buyer must first be redirected to PayPal (`https://www.sandbox.paypal.com/checkoutnow?token=...`) to authenticate and approve the payment before `POST /v2/checkout/orders/{id}/capture` can be called. The storefront was attempting to immediately capture the order synchronously without payer authorization, triggering PayPal's `UNPROCESSABLE_ENTITY: ORDER_NOT_APPROVED`.
* **Root Cause 2 (Next.js Proxy Hop-by-Hop Header Mismatch)**:
  The Next.js API proxy (`/api/[...path]/route.ts`) forwarded the incoming browser `content-length` and connection headers to upstream `fetch()`. In Node 22 (undici), this triggered `RequestContentLengthMismatchError` (`UND_ERR_REQ_CONTENT_LENGTH_MISMATCH`), throwing a 502 Gateway Error that masked underlying messages.
* **Fix Applied**:
  - **Two Checkout Options Provided**:
    1. **"Buy with PayPal" (Sandbox Flow)**: Redirects the buyer directly to PayPal's secure sandbox login and approval page. Upon buyer authorization, PayPal redirects back to `/checkout/success?ref=...`, which finalizes the capture.
    2. **"1-Click Instant Demo Buy" (Zero-Friction Evaluation)**: Instantly creates an authenticated paid order with balanced double-entry subledger journal entries, allowing instant testing of the entire dispute, AI proposal, inspection, and refund saga without needing PayPal credentials.
  - **Proxy Header Sanitization**: Stripped hop-by-hop headers (`content-length`, `connection`, `host`, `transfer-encoding`) and consumed request bodies via `req.arrayBuffer()`.
  - **Dedicated Callback Routes**: Created `/checkout/success` and `/checkout/cancel` pages complying with Impeccable UI standards.

### 2. Gemini AI Extraction Deprecation (404 Not Found)
* **Root Cause**: The Google GenAI endpoint rejected `gemini-2.5-flash` with HTTP 404 (`"This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use models/gemini-3.8-flash"`). Unhandled exceptions caused proposal generation to crash with 500.
* **Fix Applied**: Upgraded default model to `gemini-3.8-flash` in `GeminiAiClient` and added an automated fallback to deterministic structured extraction in case of API rate limits or network hiccups.

### 3. Customer Session Scoping
* **Root Cause**: `AuthService.loginDevPersona` formerly locked customer sessions to the single initial seeded order in the database, preventing customers from raising cases on newly created orders.
* **Fix Applied**: Added optional `orderId` and `email` parameters to `loginDevPersona` and updated `CasesService` to permit dispute creation whenever the authenticated customer's email matches the order.

### 4. Physical Return Inspection Gate
* **Enforced Behavior**: Under the synthetic policy clause `DEFECTIVE_DAMAGED_RETURN`, physical goods must be inspected by warehouse staff before financial execution can disburse funds.
* **Fix Applied**: The resolution saga strictly enforces this guardrail. The merchant dashboard (`/merchant`) displays the carrier tracking reference and provides a one-click warehouse inspection form ("PASSED" / "FAILED" with notes) that unlocks financial execution.

### 5. Azure Container Networking & Image Compilation
* **Root Cause**: In production, Next.js defaulted to binding on `localhost` (`127.0.0.1`), causing Azure Envoy reverse proxy to return 503 `App port is not ready`. Additionally, `.dockerignore` prevented pre-built `dist` bundles from copying over.
* **Fix Applied**: Added full `pnpm build` compilation inside multi-stage Docker builds, and set `ENV HOSTNAME=0.0.0.0` and `next start -H 0.0.0.0 -p 3000`.

---

## 📊 Live Verification Test Results (100% Passed)

| # | Test Component | Status | Details |
|---|---|---|---|
| 1 | Storefront Catalog | **PASS** | 4 products and variants fetched via Web proxy |
| 2 | PayPal Sandbox Intent | **PASS** | Valid `approveUrl` returned (`sandbox.paypal.com`) |
| 3 | 1-Click Instant Buy | **PASS** | Order `PAID`, initial double-entry subledger posted |
| 4 | Session Authentication | **PASS** | Dev persona auto-scoped to customer order |
| 5 | Dispute Case Creation | **PASS** | Case `OPEN`, immutable audit trail started |
| 6 | Gemini AI Proposals | **PASS** | Issue extracted, eligible remedy plans generated with SHA-256 hash |
| 7 | Customer Acceptance | **PASS** | Plan transitioned to `SELECTED`, return tracking assigned |
| 8 | Merchant Authorization | **PASS** | Canonical hash verified, plan transitioned to `READY` |
| 9 | Physical Inspection Gate | **PASS** | Warehouse recorded `PASSED`, gate unlocked |
| 10 | Saga Execution | **PASS** | Financial refund settled, subledger balanced, state `COMPLETED` |
| 11 | Merchant Intelligence | **PASS** | Defect rates, SKU complaint statistics aggregated |
| 12 | Reconciliation Export | **PASS** | Valid CSV with debit/credit balanced account entries |
| 13 | Callback Pages | **PASS** | `/checkout/success` & `/checkout/cancel` render 200 OK |
| 14 | WhatsApp Webhook Handshake | **PASS** | `hub.challenge` validated and returned with 200 OK |
| 15 | Live WhatsApp Simulator | **PASS** | Full bidirectional simulation, database webhook persistence, and instant portal link |
