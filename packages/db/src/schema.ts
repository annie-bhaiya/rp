import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  bigint,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// 1. Tenants
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('ACTIVE'),
  defaultCurrency: varchar('default_currency', { length: 3 }).notNull().default('USD'),
  timezone: varchar('timezone', { length: 64 }).notNull().default('UTC'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 2. Users & Memberships
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 32 }).notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const oidcIdentities = pgTable('oidc_identities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  issuer: varchar('issuer', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('oidc_issuer_subject_idx').on(t.issuer, t.subject),
]);

export const memberships = pgTable('memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 64 }).notNull().default('MERCHANT_APPROVER'),
  status: varchar('status', { length: 32 }).notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('memberships_tenant_user_idx').on(t.tenantId, t.userId),
]);

// 3. Sessions & Customer Access Tokens
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: varchar('token_hash', { length: 128 }).notNull().unique(),
  actorType: varchar('actor_type', { length: 32 }).notNull(), // 'CUSTOMER' | 'MERCHANT' | 'OPERATOR'
  actorId: uuid('actor_id').notNull(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 64 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  orderId: uuid('order_id'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('sessions_token_hash_idx').on(t.tokenHash),
]);

export const accessTokens = pgTable('access_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: varchar('token_hash', { length: 128 }).notNull().unique(),
  purpose: varchar('purpose', { length: 64 }).notNull().default('CUSTOMER_ORDER_ACCESS'),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 4. Customers & Catalog
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  locale: varchar('locale', { length: 16 }).notNull().default('en-US'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('customers_tenant_email_idx').on(t.tenantId, t.email),
]);

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull().default(''),
  category: varchar('category', { length: 64 }).notNull(),
  imageUrl: varchar('image_url', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: varchar('sku', { length: 64 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  priceMinor: varchar('price_minor', { length: 32 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  attributes: jsonb('attributes').notNull().default({}),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('variants_tenant_sku_idx').on(t.tenantId, t.sku),
]);

export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  onHand: integer('on_hand').notNull().default(0),
  reserved: integer('reserved').notNull().default(0),
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('inventory_tenant_variant_idx').on(t.tenantId, t.variantId),
]);

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').notNull(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  state: varchar('state', { length: 32 }).notNull().default('ACTIVE'), // 'ACTIVE' | 'CONSUMED' | 'RELEASED' | 'EXPIRED'
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 5. Orders & Order Items
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  orderReference: varchar('order_reference', { length: 64 }).notNull(),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('PENDING'),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  subtotalMinor: varchar('subtotal_minor', { length: 32 }).notNull(),
  taxMinor: varchar('tax_minor', { length: 32 }).notNull().default('0'),
  shippingMinor: varchar('shipping_minor', { length: 32 }).notNull().default('0'),
  totalMinor: varchar('total_minor', { length: 32 }).notNull(),
  paypalOrderId: varchar('paypal_order_id', { length: 128 }),
  paypalCaptureId: varchar('paypal_capture_id', { length: 128 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('orders_tenant_ref_idx').on(t.tenantId, t.orderReference),
]);

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id),
  sku: varchar('sku', { length: 64 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  unitPriceMinor: varchar('unit_price_minor', { length: 32 }).notNull(),
  totalPriceMinor: varchar('total_price_minor', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 6. Captures & Refunds
export const captures = pgTable('captures', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  providerCaptureId: varchar('provider_capture_id', { length: 128 }).notNull(),
  amountMinor: varchar('amount_minor', { length: 32 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  status: varchar('status', { length: 32 }).notNull().default('COMPLETED'),
  refundedMinor: varchar('refunded_minor', { length: 32 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('captures_tenant_provider_id_idx').on(t.tenantId, t.providerCaptureId),
]);

export const refunds = pgTable('refunds', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  captureId: uuid('capture_id').notNull().references(() => captures.id, { onDelete: 'cascade' }),
  resolutionId: uuid('resolution_id'),
  providerRefundId: varchar('provider_refund_id', { length: 128 }),
  amountMinor: varchar('amount_minor', { length: 32 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  status: varchar('status', { length: 32 }).notNull().default('PREPARED'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 7. Policies
export const policyVersions = pgTable('policy_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  text: text('text').notNull(),
  publisher: varchar('publisher', { length: 255 }).notNull(),
  immutableHash: varchar('immutable_hash', { length: 128 }).notNull(),
  effectiveAt: timestamp('effective_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('policies_tenant_version_idx').on(t.tenantId, t.version),
]);

export const policyClauses = pgTable('policy_clauses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  policyVersionId: uuid('policy_version_id').notNull().references(() => policyVersions.id, { onDelete: 'cascade' }),
  key: varchar('key', { length: 64 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  text: text('text').notNull(),
  structuredRule: jsonb('structured_rule').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 8. Cases, Messages & Evidence
export const cases = pgTable('cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  state: varchar('state', { length: 32 }).notNull().default('OPEN'),
  issueType: varchar('issue_type', { length: 32 }),
  constraints: jsonb('constraints').notNull().default({}),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('cases_tenant_state_idx').on(t.tenantId, t.state),
]);

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  caseId: uuid('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  channel: varchar('channel', { length: 32 }).notNull().default('WEB'),
  providerMessageId: varchar('provider_message_id', { length: 128 }),
  senderRole: varchar('sender_role', { length: 32 }).notNull(),
  body: text('body').notNull(),
  verificationState: varchar('verification_state', { length: 32 }).notNull().default('VERIFIED'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const evidence = pgTable('evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  caseId: uuid('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  blobKey: varchar('blob_key', { length: 255 }).notNull(),
  contentHash: varchar('content_hash', { length: 128 }).notNull(),
  mediaType: varchar('media_type', { length: 64 }).notNull(),
  validationState: varchar('validation_state', { length: 32 }).notNull().default('PENDING'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 9. Plans
export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  caseId: uuid('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  version: integer('version').notNull().default(1),
  canonicalHash: varchar('canonical_hash', { length: 128 }).notNull(),
  policyVersionId: uuid('policy_version_id').notNull().references(() => policyVersions.id),
  type: varchar('type', { length: 64 }).notNull(),
  state: varchar('state', { length: 32 }).notNull().default('OFFERED'),
  title: varchar('title', { length: 255 }).notNull(),
  explanation: text('explanation').notNull(),
  planData: jsonb('plan_data').notNull(),
  customerAccepted: boolean('customer_accepted').notNull().default(false),
  customerAcceptedAt: timestamp('customer_accepted_at', { withTimezone: true }),
  merchantApproved: boolean('merchant_approved').notNull().default(false),
  merchantApprovedAt: timestamp('merchant_approved_at', { withTimezone: true }),
  merchantApproverId: uuid('merchant_approver_id'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('plans_case_hash_idx').on(t.caseId, t.canonicalHash),
]);

// 10. Resolutions & Steps
export const resolutions = pgTable('resolutions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  caseId: uuid('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').notNull().references(() => plans.id, { onDelete: 'cascade' }),
  state: varchar('state', { length: 32 }).notNull().default('PREPARED'),
  currentStep: varchar('current_step', { length: 64 }),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const resolutionSteps = pgTable('resolution_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  resolutionId: uuid('resolution_id').notNull().references(() => resolutions.id, { onDelete: 'cascade' }),
  stepKey: varchar('step_key', { length: 64 }).notNull(),
  state: varchar('state', { length: 32 }).notNull().default('READY'),
  attempt: integer('attempt').notNull().default(0),
  fencingToken: integer('fencing_token').notNull().default(0),
  leaseOwner: varchar('lease_owner', { length: 128 }),
  leaseUntil: timestamp('lease_until', { withTimezone: true }),
  externalReference: varchar('external_reference', { length: 255 }),
  error: text('error'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 11. Returns & Fulfillment
export const returns = pgTable('returns', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  caseId: uuid('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 32 }).notNull().default('REQUIRED'),
  trackingReference: varchar('tracking_reference', { length: 128 }),
  carrier: varchar('carrier', { length: 64 }).notNull().default('Simulated Express'),
  inspectionResult: varchar('inspection_result', { length: 32 }),
  inspectorId: uuid('inspector_id'),
  inspectionNotes: text('inspection_notes'),
  inspectedAt: timestamp('inspected_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const fulfillments = pgTable('fulfillments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  resolutionId: uuid('resolution_id').notNull().references(() => resolutions.id, { onDelete: 'cascade' }),
  replacementOrderId: uuid('replacement_order_id'),
  status: varchar('status', { length: 32 }).notNull().default('PLANNED'),
  trackingReference: varchar('tracking_reference', { length: 128 }),
  carrier: varchar('carrier', { length: 64 }).notNull().default('Simulated Freight'),
  estimatedDelivery: timestamp('estimated_delivery', { withTimezone: true }).notNull(),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 12. Double-Entry Journal Subledger
export const journalTransactions = pgTable('journal_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  businessEventKey: varchar('business_event_key', { length: 255 }).notNull(),
  description: text('description').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('journal_tenant_event_key_idx').on(t.tenantId, t.businessEventKey),
]);

export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  transactionId: uuid('transaction_id').notNull().references(() => journalTransactions.id, { onDelete: 'cascade' }),
  accountCode: varchar('account_code', { length: 64 }).notNull(),
  debitMinor: varchar('debit_minor', { length: 32 }).notNull().default('0'),
  creditMinor: varchar('credit_minor', { length: 32 }).notNull().default('0'),
});

// 13. Operations & Reliability (Webhooks, Jobs, Outbox, Audit)
export const webhookInbox = pgTable('webhook_inbox', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider: varchar('provider', { length: 64 }).notNull(),
  connectionId: varchar('connection_id', { length: 128 }),
  eventId: varchar('event_id', { length: 255 }).notNull(),
  rawPayload: text('raw_payload').notNull(),
  verified: boolean('verified').notNull().default(false),
  state: varchar('state', { length: 32 }).notNull().default('PENDING'),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('webhook_inbox_provider_event_idx').on(t.provider, t.eventId),
]);

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 64 }).notNull(),
  dedupeKey: varchar('dedupe_key', { length: 255 }).notNull(),
  payload: jsonb('payload').notNull().default({}),
  readyAt: timestamp('ready_at', { withTimezone: true }).notNull().defaultNow(),
  state: varchar('state', { length: 32 }).notNull().default('READY'), // 'READY' | 'CLAIMED' | 'COMPLETED' | 'FAILED'
  attempts: integer('attempts').notNull().default(0),
  leaseOwner: varchar('lease_owner', { length: 128 }),
  leaseUntil: timestamp('lease_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('jobs_tenant_dedupe_idx').on(t.tenantId, t.dedupeKey),
  index('jobs_ready_state_idx').on(t.state, t.readyAt),
]);

export const outboxEvents = pgTable('outbox_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  aggregateId: uuid('aggregate_id').notNull(),
  eventType: varchar('event_type', { length: 64 }).notNull(),
  eventKey: varchar('event_key', { length: 255 }).notNull().unique(),
  payload: jsonb('payload').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  actor: varchar('actor', { length: 255 }).notNull(),
  action: varchar('action', { length: 64 }).notNull(),
  aggregateId: uuid('aggregate_id').notNull(),
  details: jsonb('details').notNull().default({}),
  traceId: varchar('trace_id', { length: 128 }).notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
});
