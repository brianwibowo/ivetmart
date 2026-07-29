/**
 * Drizzle Kit Configuration — Ivet Mart
 *
 * Used by `drizzle-kit` CLI for migrations, introspection, and studio.
 * Run: `bun run db:generate`, `bun run db:push`, `bun run db:studio`
 */

import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is required for drizzle-kit");
}

// biome-ignore lint/style/noDefaultExport: Drizzle Kit CLI requires default export
export default defineConfig({
	schema: "./lib/db/schema/*",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	verbose: true,
});
