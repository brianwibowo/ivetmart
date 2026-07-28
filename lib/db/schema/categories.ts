/**
 * Categories Table — Ivet Mart
 *
 * Product categories managed by admin.
 */

import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
	id: varchar("id", { length: 50 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).unique().notNull(),
	description: text("description"),
	image: text("image"),
	active: boolean("active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
