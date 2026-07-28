/**
 * Reviews Table — Ivet Mart
 *
 * Product reviews from buyers after order completion.
 */

import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orderItems } from "./orders";
import { products } from "./products";
import { users } from "./users";

export const reviews = pgTable("reviews", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: varchar("product_id", { length: 50 })
		.references(() => products.id, { onDelete: "cascade" })
		.notNull(),
	userId: uuid("user_id")
		.references(() => users.id)
		.notNull(),
	orderItemId: uuid("order_item_id").references(() => orderItems.id),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	images: jsonb("images").$type<string[]>().default([]),
	createdAt: timestamp("created_at").defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
