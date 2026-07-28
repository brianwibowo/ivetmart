/**
 * Wishlists Table — Ivet Mart
 *
 * Buyer product wishlist (many-to-many: user ↔ product).
 */

import { pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";

export const wishlists = pgTable(
	"wishlists",
	{
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		productId: varchar("product_id", { length: 50 })
			.references(() => products.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.productId] })],
);

export type Wishlist = typeof wishlists.$inferSelect;
