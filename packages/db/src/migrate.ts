import { sql } from 'drizzle-orm';
import { getDb } from './client.js';

export async function runMigrations(): Promise<void> {
  const db = await getDb();
  console.log('[ResolvePay DB] Initializing tables and constraints...');

  const statements = [
    `CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(64) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
      default_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS oidc_identities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      issuer VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT oidc_issuer_subject_unique UNIQUE (issuer, subject)
    )`,
    `CREATE TABLE IF NOT EXISTS memberships (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(64) NOT NULL DEFAULT 'MERCHANT_APPROVER',
      status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT memberships_tenant_user_unique UNIQUE (tenant_id, user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token_hash VARCHAR(128) NOT NULL UNIQUE,
      actor_type VARCHAR(32) NOT NULL,
      actor_id UUID NOT NULL,
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      role VARCHAR(64),
      customer_email VARCHAR(255),
      order_id UUID,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS access_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token_hash VARCHAR(128) NOT NULL UNIQUE,
      purpose VARCHAR(64) NOT NULL DEFAULT 'CUSTOMER_ORDER_ACCESS',
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      order_id UUID NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category VARCHAR(64) NOT NULL,
      image_url VARCHAR(512),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS product_variants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      sku VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      price_minor VARCHAR(32) NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      attributes JSONB NOT NULL DEFAULT '{}',
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT variants_tenant_sku_unique UNIQUE (tenant_id, sku)
    )`,
    `CREATE TABLE IF NOT EXISTS inventory (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
      on_hand INTEGER NOT NULL DEFAULT 0,
      reserved INTEGER NOT NULL DEFAULT 0,
      version INTEGER NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT inventory_tenant_variant_unique UNIQUE (tenant_id, variant_id)
    )`,
    `CREATE TABLE IF NOT EXISTS reservations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      plan_id UUID NOT NULL,
      variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      state VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      order_reference VARCHAR(64) NOT NULL,
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      customer_email VARCHAR(255) NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      subtotal_minor VARCHAR(32) NOT NULL,
      tax_minor VARCHAR(32) NOT NULL DEFAULT '0',
      shipping_minor VARCHAR(32) NOT NULL DEFAULT '0',
      total_minor VARCHAR(32) NOT NULL,
      paypal_order_id VARCHAR(128),
      paypal_capture_id VARCHAR(128),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT orders_tenant_ref_unique UNIQUE (tenant_id, order_reference)
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      variant_id UUID NOT NULL REFERENCES product_variants(id),
      sku VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price_minor VARCHAR(32) NOT NULL,
      total_price_minor VARCHAR(32) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS captures (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      provider_capture_id VARCHAR(128) NOT NULL,
      amount_minor VARCHAR(32) NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
      refunded_minor VARCHAR(32) NOT NULL DEFAULT '0',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT captures_tenant_provider_id_unique UNIQUE (tenant_id, provider_capture_id)
    )`,
    `CREATE TABLE IF NOT EXISTS refunds (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      capture_id UUID NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
      resolution_id UUID,
      provider_refund_id VARCHAR(128),
      amount_minor VARCHAR(32) NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      status VARCHAR(32) NOT NULL DEFAULT 'PREPARED',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS policy_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      text TEXT NOT NULL,
      publisher VARCHAR(255) NOT NULL,
      immutable_hash VARCHAR(128) NOT NULL,
      effective_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT policies_tenant_version_unique UNIQUE (tenant_id, version)
    )`,
    `CREATE TABLE IF NOT EXISTS policy_clauses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      policy_version_id UUID NOT NULL REFERENCES policy_versions(id) ON DELETE CASCADE,
      key VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      structured_rule JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS cases (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      state VARCHAR(32) NOT NULL DEFAULT 'OPEN',
      issue_type VARCHAR(32),
      constraints JSONB NOT NULL DEFAULT '{}',
      version INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      channel VARCHAR(32) NOT NULL DEFAULT 'WEB',
      provider_message_id VARCHAR(128),
      sender_role VARCHAR(32) NOT NULL,
      body TEXT NOT NULL,
      verification_state VARCHAR(32) NOT NULL DEFAULT 'VERIFIED',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS evidence (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      blob_key VARCHAR(255) NOT NULL,
      content_hash VARCHAR(128) NOT NULL,
      media_type VARCHAR(64) NOT NULL,
      validation_state VARCHAR(32) NOT NULL DEFAULT 'PENDING',
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      version INTEGER NOT NULL DEFAULT 1,
      canonical_hash VARCHAR(128) NOT NULL,
      policy_version_id UUID NOT NULL REFERENCES policy_versions(id),
      type VARCHAR(64) NOT NULL,
      state VARCHAR(32) NOT NULL DEFAULT 'OFFERED',
      title VARCHAR(255) NOT NULL,
      explanation TEXT NOT NULL,
      plan_data JSONB NOT NULL,
      customer_accepted BOOLEAN NOT NULL DEFAULT false,
      customer_accepted_at TIMESTAMPTZ,
      merchant_approved BOOLEAN NOT NULL DEFAULT false,
      merchant_approved_at TIMESTAMPTZ,
      merchant_approver_id UUID,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS resolutions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      state VARCHAR(32) NOT NULL DEFAULT 'PREPARED',
      current_step VARCHAR(64),
      version INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS resolution_steps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      resolution_id UUID NOT NULL REFERENCES resolutions(id) ON DELETE CASCADE,
      step_key VARCHAR(64) NOT NULL,
      state VARCHAR(32) NOT NULL DEFAULT 'READY',
      attempt INTEGER NOT NULL DEFAULT 0,
      fencing_token INTEGER NOT NULL DEFAULT 0,
      lease_owner VARCHAR(128),
      lease_until TIMESTAMPTZ,
      external_reference VARCHAR(255),
      error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS returns (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      status VARCHAR(32) NOT NULL DEFAULT 'REQUIRED',
      tracking_reference VARCHAR(128),
      carrier VARCHAR(64) NOT NULL DEFAULT 'Simulated Express',
      inspection_result VARCHAR(32),
      inspector_id UUID,
      inspection_notes TEXT,
      inspected_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS fulfillments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      resolution_id UUID NOT NULL REFERENCES resolutions(id) ON DELETE CASCADE,
      replacement_order_id UUID,
      status VARCHAR(32) NOT NULL DEFAULT 'PLANNED',
      tracking_reference VARCHAR(128),
      carrier VARCHAR(64) NOT NULL DEFAULT 'Simulated Freight',
      estimated_delivery TIMESTAMPTZ NOT NULL,
      delivered_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS journal_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      business_event_key VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT journal_tenant_event_key_unique UNIQUE (tenant_id, business_event_key)
    )`,
    `CREATE TABLE IF NOT EXISTS journal_entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      transaction_id UUID NOT NULL REFERENCES journal_transactions(id) ON DELETE CASCADE,
      account_code VARCHAR(64) NOT NULL,
      debit_minor VARCHAR(32) NOT NULL DEFAULT '0',
      credit_minor VARCHAR(32) NOT NULL DEFAULT '0'
    )`,
    `CREATE TABLE IF NOT EXISTS webhook_inbox (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      provider VARCHAR(64) NOT NULL,
      connection_id VARCHAR(128),
      event_id VARCHAR(255) NOT NULL,
      raw_payload TEXT NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT false,
      state VARCHAR(32) NOT NULL DEFAULT 'PENDING',
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT webhook_inbox_provider_event_unique UNIQUE (provider, event_id)
    )`,
    `CREATE TABLE IF NOT EXISTS jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      type VARCHAR(64) NOT NULL,
      dedupe_key VARCHAR(255) NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}',
      ready_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      state VARCHAR(32) NOT NULL DEFAULT 'READY',
      attempts INTEGER NOT NULL DEFAULT 0,
      lease_owner VARCHAR(128),
      lease_until TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT jobs_tenant_dedupe_unique UNIQUE (tenant_id, dedupe_key)
    )`,
    `CREATE TABLE IF NOT EXISTS outbox_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      aggregate_id UUID NOT NULL,
      event_type VARCHAR(64) NOT NULL,
      event_key VARCHAR(255) NOT NULL UNIQUE,
      payload JSONB NOT NULL,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS audit_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      actor VARCHAR(255) NOT NULL,
      action VARCHAR(64) NOT NULL,
      aggregate_id UUID NOT NULL,
      details JSONB NOT NULL DEFAULT '{}',
      trace_id VARCHAR(128) NOT NULL,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS merchant_login_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token_hash VARCHAR(128) NOT NULL UNIQUE,
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  ];

  for (const stmt of statements) {
    await db.execute(sql.raw(stmt));
  }

  console.log('[ResolvePay DB] Tables and constraints migration complete.');
}

if (process.argv[1]?.includes('migrate')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[ResolvePay DB] Migration failed:', err);
      process.exit(1);
    });
}
