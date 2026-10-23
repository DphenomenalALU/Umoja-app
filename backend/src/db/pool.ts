import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & { umojaPool?: Pool };

export const pool = globalForPostgres.umojaPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.umojaPool = pool;
}
