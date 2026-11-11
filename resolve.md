# ResolvePay — Operations Guide & Action Items (resolve.md)

This file documents the live cloud environment, explains all resolved errors and root causes, and details all third-party webhook and sandbox configurations.

---

## 🌟 Live Azure Deployment Endpoints (ACTIVE & HEALTHY)

Both the **Frontend Web App** and **Backend REST API** are running live on Azure Container Apps:

* **Customer & Merchant Web App**:
  👉 **[https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io](https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io)**
  - **Storefront & Catalog**: `/`
  - **Customer Self-Service Portal**: `/portal` (or `/portal/orders/<orderId>`)
  - **Merchant Command Center & Intelligence**: `/merchant`
  - **In-Memory Dev Mailbox**: `/mailbox`

* **Backend REST API**:
  👉 **[https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io](https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io)**
  - Health probe: `/api/v1/health`
  - Catalog: `/api/v1/catalog?tenantSlug=default-merchant`
  - Webhooks: `/api/v1/webhooks/*`

* **Cloud Infrastructure**:
  - **Resource Group**: `rg-resolvepay-centralindia` (Region: Central India)
  - **Container Apps Environment**: `cae-resolvepay`
  - **Azure Container Registry**: `crresolvepay.azurecr.io`
    - API Image: `crresolvepay.azurecr.io/resolvepay-api:v5` (Status: Healthy, 1 replica)
    - Web Image: `crresolvepay.azurecr.io/resolvepay-web:v4` (Status: Healthy, 1 replica)
  - **Database**: Cloud Supabase PostgreSQL 17 (`ap-south-1` Mumbai)

---

## 🔍 Root Cause Analysis & Fixes Implemented

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

## 📱 User Action Items

### 1. Complete Meta WhatsApp Cloud API Webhook Handshake
The backend endpoint is live and verified with the challenge protocol:

1. Open the [Meta for Developers App Dashboard](https://developers.facebook.com/apps/).
2. Select your app -> **WhatsApp** -> **Configuration**.
3. Under **Webhook**, click **Edit**:
   - **Callback URL**:
     ```text
     https://resolvepay-api.politetree-c3c2d975.centralindia.azurecontainerapps.io/api/v1/webhooks/whatsapp
     ```
   - **Verify Token**:
     ```text
     resolvepay_meta_verify_2026
     ```
4. Click **Verify and save**.
5. Under **Webhook fields**, click **Manage** and subscribe to:
   - ✅ **`messages`**

> [!NOTE]
> If testing incoming WhatsApp messages, ensure your personal WhatsApp phone number is added to the authorized recipient list under **WhatsApp > API Setup > To (Manage phone number list)** in Meta's dashboard.

---

### 2. Testing PayPal Sandbox Purchases (Optional)
If you wish to test the full live redirect flow instead of the **1-Click Instant Demo Buy**:

1. On the storefront [https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io](https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io), select any item and click **"Buy with PayPal"**.
2. You will be redirected to PayPal Sandbox.
3. Log in using a PayPal Sandbox Personal/Buyer account created in your [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/accounts):
   - Example default test buyer credentials:
     - **Email**: `sb-buyer@business.example.com` (or your sandbox personal account)
     - **Password**: (your sandbox personal password)
4. Click **Complete Purchase**.
5. You will be redirected back to ResolvePay `/checkout/success`, which captures the funds and displays the order reference.

---

### 3. How to Verify the Entire System in Under 60 Seconds
You can test the full autonomous workflow right now directly in your browser:

1. **Place an Order**: Go to [https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io](https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io) and click **"1-Click Demo Buy"** on any product.
2. **Open Dispute**: On the confirmation screen, click **"Open Resolution Case"**.
3. **Select Remedy**: Choose an issue (e.g., "damaged") and submit. Review the AI-generated proposals and click **"Accept Remedy"**.
4. **Merchant Warehouse Inspection & Approval**:
   - Open [https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io/merchant](https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io/merchant).
   - Click on the new case.
   - Click **"Authorize Plan"**.
   - Under Physical Return Inspection, click **"Confirm & Pass Inspection"**.
   - Click **"Execute Resolution Saga"**.
5. **View Subledger & Insights**:
   - Switch to the **Insights** tab to see real-time dispute metrics and product defect rates.
   - Click **Export Reconciliation CSV** to download the double-entry accounting audit trail.

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
