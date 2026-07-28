/**
 * Database Connection — Ivet Mart
 *
 * PostgreSQL connection via `postgres` driver + Drizzle ORM.
 * Uses connection pooling with sensible defaults for Next.js serverless.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error(
		"DATABASE_URL is not set. Add it to .env.local (e.g. postgresql://user:pass@localhost:5432/ivetmart)",
	);
}

/**
 * Raw postgres client — use `db` (Drizzle wrapper) instead of this directly.
 * `max: 10` keeps connections reasonable for Next.js dev + serverless.
 */
const client = postgres(connectionString, {
	max: 10,
	idle_timeout: 20,
	connect_timeout: 10,
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
