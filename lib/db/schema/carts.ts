/**
 * Carts & Cart Items Tables — Ivet Mart
 *
 * Shopping carts linked to users (or anonymous via cookie).
 */

import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { variants } from "./products";
import { users } from "./users";

export const carts = pgTable("carts", {
	id: varchar("id", { length: 100 }).primaryKey(),
	userId: uuid("user_id").references(() => users.id),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable(
	"cart_items",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		cartId: varchar("cart_id", { length: 100 })
			.references(() => carts.id, { onDelete: "cascade" })
			.notNull(),
		variantId: varchar("variant_id", { length: 50 })
			.references(() => variants.id)
			.notNull(),
		quantity: integer("quantity").notNull().default(1),
	},
	(t) => [unique().on(t.cartId, t.variantId)],
);

// ─── Relations ──────────────────────────────────────────

export const cartsRelations = relations(carts, ({ one, many }) => ({
	user: one(users, { fields: [carts.userId], references: [users.id] }),
	items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
	variant: one(variants, {
		fields: [cartItems.variantId],
		references: [variants.id],
	}),
}));

export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
