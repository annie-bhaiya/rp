import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import * as schema from './schema.js';
import { sql } from 'drizzle-orm';

const { Pool } = pg;

export type DrizzleDb = ReturnType<typeof drizzlePg<typeof schema>>;

let cachedDb: DrizzleDb | null = null;
let pgliteInstance: PGlite | null = null;

export async function getDb(databaseUrl?: string): Promise<DrizzleDb> {
  if (cachedDb) return cachedDb;

  const url = databaseUrl || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/resolvepay';

  if (url.startsWith('memory://') || url.startsWith('pglite://')) {
    const dataDir = url.startsWith('pglite://') ? url.replace('pglite://', '') : undefined;
    if (dataDir) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    pgliteInstance = new PGlite(dataDir);
    await pgliteInstance.waitReady;
    cachedDb = drizzlePglite(pgliteInstance, { schema }) as unknown as DrizzleDb;
    return cachedDb;
  }

  // Attempt connecting to live PostgreSQL
  try {
    const pool = new Pool({
      connectionString: url,
      max: 10,
      connectionTimeoutMillis: 3000,
    });
    // Test connectivity
    const client = await pool.connect();
    client.release();

    cachedDb = drizzlePg(pool, { schema });
    return cachedDb;
  } catch (err) {
    console.warn(`[ResolvePay DB] Could not connect to external PostgreSQL at ${url}. Falling back to embedded PGlite engine.`, (err as Error).message);
    // Locate repo root directory to ensure all processes share the same DB files
    let repoRoot = process.cwd();
    while (repoRoot.includes('apps') || repoRoot.includes('packages')) {
      repoRoot = path.dirname(repoRoot);
    }
    const localDir = path.resolve(repoRoot, '.data/postgres');
    fs.mkdirSync(localDir, { recursive: true });
    pgliteInstance = new PGlite(localDir);
    await pgliteInstance.waitReady;
    cachedDb = drizzlePglite(pgliteInstance, { schema }) as unknown as DrizzleDb;
    return cachedDb;
  }
}

/**
 * Runs an operation scoped to a specific tenant using PostgreSQL set_config transaction-locally.
 * Required by plan.md §6.3 to prevent cross-tenant state leakage in connection pooling.
 */
export async function withTenantContext<T>(
  db: DrizzleDb,
  tenantId: string,
  fn: (tx: DrizzleDb) => Promise<T>
): Promise<T> {
  return await db.transaction(async (tx) => {
    // Set tenant context for this transaction
    await tx.execute(sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`);
    return await fn(tx as unknown as DrizzleDb);
  });
}
