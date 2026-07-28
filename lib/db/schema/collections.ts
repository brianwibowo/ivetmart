/**
 * Collections & Product-Collections Tables — Ivet Mart
 *
 * Collections are curated groups of products (e.g. "Bestsellers", "Featured").
 * Many-to-many relationship via product_collections junction table.
 */

import { boolean, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { products } from "./products";

export const collections = pgTable("collections", {
	id: varchar("id", { length: 50 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).unique().notNull(),
	description: text("description"),
	image: text("image"),
	active: boolean("active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
});

export const productCollections = pgTable(
	"product_collections",
	{
		productId: varchar("product_id", { length: 50 })
			.references(() => products.id, { onDelete: "cascade" })
			.notNull(),
		collectionId: varchar("collection_id", { length: 50 })
			.references(() => collections.id, { onDelete: "cascade" })
			.notNull(),
	},
	(t) => [primaryKey({ columns: [t.productId, t.collectionId] })],
);

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
