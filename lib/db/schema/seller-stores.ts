/**
 * Seller Stores Table — Ivet Mart
 *
 * Each seller user owns one store. Stores require admin approval before
 * the seller can list products.
 */

import { decimal, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { storeStatusEnum } from "./enums";
import { users } from "./users";

export const sellerStores = pgTable("seller_stores", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.unique()
		.notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).unique().notNull(),
	description: text("description"),
	logoUrl: text("logo_url"),
	bannerUrl: text("banner_url"),
	address: text("address"),
	city: varchar("city", { length: 100 }),
	province: varchar("province", { length: 100 }),
	postalCode: varchar("postal_code", { length: 10 }),
	phone: varchar("phone", { length: 20 }),
	status: storeStatusEnum("status").notNull().default("pending"),
	verifiedAt: timestamp("verified_at"),
	ratingAvg: decimal("rating_avg", { precision: 3, scale: 2 }).default("0"),
	totalSales: integer("total_sales").default(0),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type SellerStore = typeof sellerStores.$inferSelect;
export type NewSellerStore = typeof sellerStores.$inferInsert;
