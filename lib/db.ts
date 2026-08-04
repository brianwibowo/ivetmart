/**
 * Database Connection — Ivet Mart
 *
 * PostgreSQL connection via `postgres` driver + Drizzle ORM.
 * Uses connection pooling with sensible defaults for Next.js serverless.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL || "postgres://build:build@localhost:5432/build";

/**
 * Raw postgres client — use `db` (Drizzle wrapper) instead of this directly.
 * `max: 10` keeps connections reasonable for Next.js dev + serverless.
 */
const isTestEnv = process.env.NODE_ENV === "test" || process.env.BUN_ENV === "test" || !!process.env.CI;

const client = postgres(connectionString, {
	max: isTestEnv ? 1 : 10,
	idle_timeout: isTestEnv ? 1 : 20,
	connect_timeout: isTestEnv ? 1 : 5,
});

/**
 * Drizzle ORM instance — import this everywhere you need database access.
 *
 * @example
 * ```ts
 * import { db } from "@/lib/db";
 * import { users } from "@/lib/db/schema";
 *
 * const allUsers = await db.select().from(users);
 * ```
 */
export const db = drizzle(client, { schema });
