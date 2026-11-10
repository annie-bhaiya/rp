import { sql } from 'drizzle-orm';
import { getDb } from './client.js';
import { runMigrations } from './migrate.js';

export async function runSeed(): Promise<void> {
  await runMigrations();
  const db = await getDb();
  console.log('[ResolvePay DB] Seeding synthetic tenants, catalog, and policies...');

  const statements = [
    // 1. Tenants (PeakGear and Apex Tech for two-tenant isolation testing)
    `INSERT INTO tenants (id, slug, name, status, default_currency, timezone)
     VALUES ('00000000-0000-0000-0000-000000000001', 'default-merchant', 'PeakGear Outfitter', 'ACTIVE', 'USD', 'UTC')
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,

    `INSERT INTO tenants (id, slug, name, status, default_currency, timezone)
     VALUES ('00000000-0000-0000-0000-000000000002', 'second-merchant', 'Apex Tech Studio', 'ACTIVE', 'USD', 'UTC')
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,

    // 2. Users & Memberships
    `INSERT INTO users (id, name, email, status)
     VALUES ('10000000-0000-0000-0000-000000000001', 'Marcus Vance (Owner)', 'owner@peakgear.demo', 'ACTIVE')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,

    `INSERT INTO users (id, name, email, status)
     VALUES ('10000000-0000-0000-0000-000000000002', 'Elena Rostova (Approver)', 'approver@peakgear.demo', 'ACTIVE')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,

    `INSERT INTO users (id, name, email, status)
     VALUES ('10000000-0000-0000-0000-000000000003', 'Hackathon Judge', 'judge@hackathon.demo', 'ACTIVE')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,

    `INSERT INTO memberships (tenant_id, user_id, role, status)
     VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'MERCHANT_OWNER', 'ACTIVE')
     ON CONFLICT (tenant_id, user_id) DO NOTHING`,

    `INSERT INTO memberships (tenant_id, user_id, role, status)
     VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'MERCHANT_APPROVER', 'ACTIVE')
     ON CONFLICT (tenant_id, user_id) DO NOTHING`,

    `INSERT INTO memberships (tenant_id, user_id, role, status)
     VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'JUDGE', 'ACTIVE')
     ON CONFLICT (tenant_id, user_id) DO NOTHING`,

    // 3. Customer
    `INSERT INTO customers (id, tenant_id, email, name, locale)
     VALUES ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'alex.customer@example.com', 'Alex Johnson', 'en-US')
     ON CONFLICT DO NOTHING`,

    // 4. Products & Variants
    `INSERT INTO products (id, tenant_id, title, description, category, image_url)
     VALUES ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Apex Trail Backpack 40L', 'Ultralight waterproof 40L technical alpine backpack with reinforced YKK zippers.', 'Backpacks', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80')
     ON CONFLICT DO NOTHING`,

    `INSERT INTO products (id, tenant_id, title, description, category, image_url)
     VALUES ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Ultralight Carbon Trekking Poles', 'Pair of quick-lock aerospace carbon fiber poles with ergonomic cork grips.', 'Poles', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80')
     ON CONFLICT DO NOTHING`,

    `INSERT INTO products (id, tenant_id, title, description, category, image_url)
     VALUES ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'StormShield Mountain Jacket', '3-layer GORE-TEX waterproof breathable mountaineering hardshell.', 'Apparel', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80')
     ON CONFLICT DO NOTHING`,

    `INSERT INTO products (id, tenant_id, title, description, category, image_url)
     VALUES ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'SummitPro Expedition Backpack 50L', 'Expanded 50L multi-day alpine expedition pack with custom suspension system.', 'Backpacks', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80')
     ON CONFLICT DO NOTHING`,

    `INSERT INTO product_variants (id, tenant_id, product_id, sku, title, price_minor, currency, attributes, active)
     VALUES ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'APEX-BP-40L-BLK', 'Apex Trail Backpack 40L - Stealth Black', '12000', 'USD', '{"color":"Black","size":"40L"}', true)
     ON CONFLICT (tenant_id, sku) DO NOTHING`,

    `INSERT INTO product_variants (id, tenant_id, product_id, sku, title, price_minor, currency, attributes, active)
     VALUES ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'POLES-CRBN-PAIR', 'Ultralight Carbon Trekking Poles - Red', '6500', 'USD', '{"material":"Carbon"}', true)
     ON CONFLICT (tenant_id, sku) DO NOTHING`,

    `INSERT INTO product_variants (id, tenant_id, product_id, sku, title, price_minor, currency, attributes, active)
     VALUES ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'JACKET-SS-M-BLU', 'StormShield Mountain Jacket - Cobalt Blue / M', '18000', 'USD', '{"size":"M","color":"Cobalt Blue"}', true)
     ON CONFLICT (tenant_id, sku) DO NOTHING`,

    `INSERT INTO product_variants (id, tenant_id, product_id, sku, title, price_minor, currency, attributes, active)
     VALUES ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', 'SUMMIT-BP-50L-RED', 'SummitPro Expedition Backpack 50L - Alpine Red', '13500', 'USD', '{"size":"50L","color":"Alpine Red"}', true)
     ON CONFLICT (tenant_id, sku) DO NOTHING`,

    `INSERT INTO inventory (tenant_id, variant_id, on_hand, reserved, version)
     VALUES ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 25, 0, 1)
     ON CONFLICT (tenant_id, variant_id) DO NOTHING`,

    `INSERT INTO inventory (tenant_id, variant_id, on_hand, reserved, version)
     VALUES ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 40, 0, 1)
     ON CONFLICT (tenant_id, variant_id) DO NOTHING`,

    `INSERT INTO inventory (tenant_id, variant_id, on_hand, reserved, version)
     VALUES ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 15, 0, 1)
     ON CONFLICT (tenant_id, variant_id) DO NOTHING`,

    `INSERT INTO inventory (tenant_id, variant_id, on_hand, reserved, version)
     VALUES ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 12, 0, 1)
     ON CONFLICT (tenant_id, variant_id) DO NOTHING`,

    // 5. Baseline Policy Version and Clauses
    `INSERT INTO policy_versions (id, tenant_id, version, text, publisher, immutable_hash, effective_at)
     VALUES ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1, 'PeakGear Official Return, Remedy, and Exchange Policy v1.0. Covers damaged, missing, and alternative exchange remedies.', 'Marcus Vance (Owner)', 'hash-peakgear-policy-v1', NOW())
     ON CONFLICT (tenant_id, version) DO NOTHING`,

    `INSERT INTO policy_clauses (id, tenant_id, policy_version_id, key, title, text, structured_rule)
     VALUES (
       '60000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000001',
       '50000000-0000-0000-0000-000000000001',
       'DEFECTIVE_DAMAGED_RETURN',
       'Damaged or Defective Items',
       'Items received in damaged or non-functional condition (such as broken zippers or tears) within 30 days of delivery are eligible for a 100% refund or same-item replacement. A prepaid return shipping label will be provided. The physical item must be received and undergo merchant physical inspection before funds are disbursed or replacement dispatched.',
       '{"requiresReturn": true, "requiresInspection": true, "windowDays": 30}'
     )
     ON CONFLICT DO NOTHING`,

    `INSERT INTO policy_clauses (id, tenant_id, policy_version_id, key, title, text, structured_rule)
     VALUES (
       '60000000-0000-0000-0000-000000000002',
       '00000000-0000-0000-0000-000000000001',
       '50000000-0000-0000-0000-000000000001',
       'MISSING_ITEMS_DELIVERY',
       'Missing Items in Shipment',
       'If an item is missing from a delivered parcel, the customer is entitled to immediate no-cost reshipment or a full item refund without return requirement, upon delivery carrier status verification.',
       '{"requiresReturn": false, "requiresInspection": false}'
     )
     ON CONFLICT DO NOTHING`,

    `INSERT INTO policy_clauses (id, tenant_id, policy_version_id, key, title, text, structured_rule)
     VALUES (
       '60000000-0000-0000-0000-000000000003',
       '00000000-0000-0000-0000-000000000001',
       '50000000-0000-0000-0000-000000000001',
       'ALTERNATIVE_EXCHANGE_CREDIT',
       'Exchange for Alternative Items',
       'Customers may exchange an eligible return item for an alternative catalog item. The full value of the returned item is credited toward the replacement. If the replacement is more expensive, the customer pays the remaining balance at checkout. If cheaper, the remaining difference is refunded.',
       '{"supportsExchange": true, "creditFullValue": true}'
     )
     ON CONFLICT DO NOTHING`,

    // 6. Synthetic Completed Order (USD 120.00 Backpack + $65.00 Poles = $185.00 total)
    `INSERT INTO orders (
       id, tenant_id, order_reference, customer_id, customer_email, customer_name,
       status, currency, subtotal_minor, tax_minor, shipping_minor, total_minor,
       paypal_order_id, paypal_capture_id
     )
     VALUES (
       '70000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000001',
       'ORD-2026-9041',
       '20000000-0000-0000-0000-000000000001',
       'alex.customer@example.com',
       'Alex Johnson',
       'PAID',
       'USD',
       '18500',
       '0',
       '0',
       '18500',
       'PAYPAL-ORD-SYNTH-9041',
       'PAYPAL-CAP-SYNTH-9041'
     )
     ON CONFLICT (tenant_id, order_reference) DO NOTHING`,

    `INSERT INTO order_items (
       id, tenant_id, order_id, variant_id, sku, title, quantity, unit_price_minor, total_price_minor
     )
     VALUES (
       '80000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000001',
       '70000000-0000-0000-0000-000000000001',
       '40000000-0000-0000-0000-000000000001',
       'APEX-BP-40L-BLK',
       'Apex Trail Backpack 40L - Stealth Black',
       1,
       '12000',
       '12000'
     )
     ON CONFLICT DO NOTHING`,

    `INSERT INTO order_items (
       id, tenant_id, order_id, variant_id, sku, title, quantity, unit_price_minor, total_price_minor
     )
     VALUES (
       '80000000-0000-0000-0000-000000000002',
       '00000000-0000-0000-0000-000000000001',
       '70000000-0000-0000-0000-000000000001',
       '40000000-0000-0000-0000-000000000002',
       'POLES-CRBN-PAIR',
       'Ultralight Carbon Trekking Poles - Red',
       1,
       '6500',
       '6500'
     )
     ON CONFLICT DO NOTHING`,

    `INSERT INTO captures (
       id, tenant_id, order_id, provider_capture_id, amount_minor, currency, status, refunded_minor
     )
     VALUES (
       '90000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000001',
       '70000000-0000-0000-0000-000000000001',
       'PAYPAL-CAP-SYNTH-9041',
       '18500',
       'USD',
       'COMPLETED',
       '0'
     )
     ON CONFLICT (tenant_id, provider_capture_id) DO NOTHING`,

    `INSERT INTO journal_transactions (
       id, tenant_id, business_event_key, description, currency, occurred_at
     )
     VALUES (
       'a0000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000001',
       'ORDER_CAPTURE:70000000-0000-0000-0000-000000000001',
       'Order capture for ORD-2026-9041',
       'USD',
       NOW()
     )
     ON CONFLICT (tenant_id, business_event_key) DO NOTHING`,

    `INSERT INTO journal_entries (
       id, tenant_id, transaction_id, account_code, debit_minor, credit_minor
     )
     VALUES ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'PAYPAL_CLEARING', '18500', '0')
     ON CONFLICT DO NOTHING`,

    `INSERT INTO journal_entries (
       id, tenant_id, transaction_id, account_code, debit_minor, credit_minor
     )
     VALUES ('b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'SALES_REVENUE', '0', '18500')
     ON CONFLICT DO NOTHING`,
  ];

  for (const stmt of statements) {
    await db.execute(sql.raw(stmt));
  }

  console.log('[ResolvePay DB] Seed completed successfully.');
}

if (process.argv[1]?.includes('seed')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[ResolvePay DB] Seed failed:', err);
      process.exit(1);
    });
}
