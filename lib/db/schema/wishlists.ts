/**
 * Wishlists Table — Ivet Mart
 *
 * Buyer product wishlist (many-to-many: user ↔ product).
 */

import { pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { products } from "./products";

export const wishlists = pgTable(
	"wishlists",
	{
		userId: text("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		productId: varchar("product_id", { length: 50 })
			.references(() => products.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.productId] })],
);

export type Wishlist = typeof wishlists.$inferSelect;
