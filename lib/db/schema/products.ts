/**
 * Products & Variants Tables — Ivet Mart
 *
 * Products belong to a seller store and a category.
 * Each product has one or more variants (size, color, etc).
 */

import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { sellerStores } from "./seller-stores";

export const products = pgTable("products", {
	id: varchar("id", { length: 50 }).primaryKey(),
	sellerStoreId: uuid("seller_store_id").references(() => sellerStores.id),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).unique().notNull(),
	description: text("description"),
	summary: text("summary"),
	categoryId: varchar("category_id", { length: 50 }).references(() => categories.id),
	images: jsonb("images").$type<string[]>().default([]),
	active: boolean("active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const variants = pgTable("variants", {
	id: varchar("id", { length: 50 }).primaryKey(),
	productId: varchar("product_id", { length: 50 }).references(() => products.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }),
	price: bigint("price", { mode: "number" }).notNull(),
	stock: integer("stock").default(0),
	images: jsonb("images").$type<string[]>().default([]),
	attributes: jsonb("attributes").$type<Record<string, string>>().default({}),
});

// ─── Relations ──────────────────────────────────────────

export const productsRelations = relations(products, ({ one, many }) => ({
	sellerStore: one(sellerStores, {
		fields: [products.sellerStoreId],
		references: [sellerStores.id],
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	variants: many(variants),
}));

export const variantsRelations = relations(variants, ({ one }) => ({
	product: one(products, {
		fields: [variants.productId],
		references: [products.id],
	}),
}));

// ─── Types ──────────────────────────────────────────────

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Variant = typeof variants.$inferSelect;
export type NewVariant = typeof variants.$inferInsert;
