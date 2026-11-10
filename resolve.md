# ResolvePay — Action Items for User (resolve.md)

This file tracks all external credentials, account setups, and cloud resources that require user configuration or secrets.
The application includes capable local implementations (Docker Compose PostgreSQL, sandbox/mock providers, synthetic auth, local file storage) so that the entire system compiles, tests, and runs locally without waiting for these external services.

---

### 1. Google Gemini API Key
* **Purpose**: AI issue extraction from complaints and grounded remedy explanation.
* **Status Needed**:
  1. Visit [Google AI Studio](https://aistudio.google.com/) and create an API key.
  2. Set `GEMINI_API_KEY="your-api-key"` in `.env`.
  3. Ensure `GEMINI_MODEL="gemini-2.5-flash"` (or your preferred free-tier model).
* **Local Alternative**: The application includes a deterministic rule-based AI provider fallback when `GEMINI_API_KEY` is empty, ensuring offline and test reliability.

---

### 2. PayPal Sandbox Developer Account
* **Purpose**: Sandbox order checkout, cardless buyer approval, capture, and real PayPal refunds.
* **Status Needed**:
  1. Log into [PayPal Developer Dashboard](https://developer.paypal.com/).
  2. Create a REST API app under **Sandbox** mode.
  3. Note `Client ID` and `SecretKey`.
  4. Create sandbox personal (buyer) and business (seller) accounts.
  5. Configure in `.env`:
     ```env
     PAYPAL_MODE=sandbox
     PAYPAL_CLIENT_ID="<your-sandbox-client-id>"
     PAYPAL_CLIENT_SECRET="<your-sandbox-client-secret>"
     PAYPAL_WEBHOOK_ID="<your-registered-webhook-id>"
     ```
* **Local Alternative**: Built-in mock payment adapter for automated testing and deterministic offline demos.

---

### 3. Email Delivery & Inbound (Resend)
* **Purpose**: Sending customer order access magic links, status notifications, and handling inbound email replies.
* **Status Needed**:
  1. Register at [Resend.com](https://resend.com/).
  2. Verify domain `divyansh.live` (add SPF, DKIM, DMARC records as requested by Resend).
  3. Generate an API Key.
  4. Configure in `.env`:
     ```env
     EMAIL_PROVIDER=resend
     RESEND_API_KEY="re_..."
     EMAIL_FROM=resolvepay@divyansh.live
     RESEND_WEBHOOK_SECRET="<webhook-signing-secret>"
     ```
* **Local Alternative**: In-memory and local logger email adapter that dumps access links to console and API endpoint `/api/v1/dev/mailbox` for instant verification.

---

### 4. Meta WhatsApp Cloud API
* **Purpose**: Customer timeline notifications and messaging intake over WhatsApp.
* **Status Needed**:
  1. Go to [Meta for Developers](https://developers.facebook.com/).
  2. Set up a WhatsApp Business App with test phone numbers and authorized test recipients.
  3. Obtain Temporary/Permanent Access Token and Phone Number ID.
  4. Configure in `.env`:
     ```env
     WHATSAPP_MODE=test
     META_APP_SECRET="<meta-app-secret>"
     META_ACCESS_TOKEN="<access-token>"
     META_PHONE_NUMBER_ID="<phone-number-id>"
     META_WEBHOOK_VERIFY_TOKEN="<random-verify-token>"
     PAID_MESSAGING_ENABLED=false
     ```
* **Local Alternative**: Mock WhatsApp webhook endpoint and simulation timeline adapter.

---

### 5. Identity Providers (Google & Microsoft OIDC)
* **Purpose**: Merchant owner and staff single sign-on.
* **Status Needed**:
  1. **Google Cloud Console**: OAuth 2.0 Client ID with redirect URI `https://<your-domain>/api/v1/auth/google/callback`.
  2. **Microsoft Entra ID / Azure Portal**: App registration with redirect URI `https://<your-domain>/api/v1/auth/microsoft/callback`.
  3. Configure in `.env`:
     ```env
     GOOGLE_OIDC_CLIENT_ID="<client-id>"
     GOOGLE_OIDC_CLIENT_SECRET="<client-secret>"
     MICROSOFT_OIDC_CLIENT_ID="<client-id>"
     MICROSOFT_OIDC_CLIENT_SECRET="<client-secret>"
     ```
* **Local Alternative**: Demo / Dev bypass login button with pre-seeded merchant and judge identities.

---

### 6. Azure Cloud Deployment
* **Purpose**: Hosting Container Apps (Web, API, Worker) and Azure Database for PostgreSQL Flexible Server within the USD 30/mo budget.
* **Status Needed**:
  1. Ensure Azure CLI is installed and run `az login`.
  2. Select subscription with `az account set --subscription <id>`.
  3. Run Bicep deployment from `infra/bicep/main.bicep`.
  4. Configure Azure Blob storage container for customer photo evidence:
     ```env
     AZURE_STORAGE_ACCOUNT="<account-name>"
     AZURE_STORAGE_CONTAINER="evidence"
     ```
* **Local Alternative**: Local Docker Compose with PostgreSQL 16 container, embedded PGlite, and local filesystem/blob storage.

---

### 7. Supabase PostgreSQL (Configured & Live!)
* **Purpose**: Production & cloud-hosted PostgreSQL 17 database with native connection pooling and zero hosting fee.
* **Status**: **COMPLETE / ACTIVE**
  - **Project Name**: `resolvepay-rescue`
  - **Project Ref**: `sizcvwkachvduchqentw`
  - **Region**: `ap-south-1` (Mumbai)
  - **Dashboard**: [https://supabase.com/dashboard/project/sizcvwkachvduchqentw](https://supabase.com/dashboard/project/sizcvwkachvduchqentw)
  - **Status**: Live, 28 tables migrated, synthetic tenants, catalog, and policies seeded.
  - **Connection URI**: Configured in `.env` via Supavisor pooler on port 5432.
* **Offline Alternative**: If network is disconnected or `DATABASE_URL` is unset, the application automatically falls back to embedded `@electric-sql/pglite` saving to `.data/postgres`.

