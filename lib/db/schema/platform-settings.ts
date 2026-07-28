/**
 * Platform Settings Table — Ivet Mart
 *
 * Key-value store for marketplace-wide settings
 * (announcement bar, feature flags, commission rates, etc).
 */

import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const platformSettings = pgTable("platform_settings", {
	key: varchar("key", { length: 100 }).primaryKey(),
	value: jsonb("value").notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
