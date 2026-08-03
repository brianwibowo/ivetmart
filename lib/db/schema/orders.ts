/**
 * Orders Tables — Ivet Mart
 *
 * Multi-seller order architecture:
 * - `orders`: master order (one per checkout)
 * - `orderSellers`: sub-order per seller in the order
 * - `orderItems`: line items belonging to a seller sub-order
 *
 * This allows a single checkout to create orders to multiple sellers,
 * each tracked independently (status, shipping, tracking).
 */

import { relations } from "drizzle-orm";
import { bigint, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { addresses } from "./addresses";
import { user } from "./auth";
import { orderStatusEnum } from "./enums";
import { variants } from "./products";
import { sellerStores } from "./seller-stores";

// ─── Master Order ───────────────────────────────────────

export const orders = pgTable("orders", {
	id: uuid("id").primaryKey().defaultRandom(),
	buyerId: text("buyer_id")
		.references(() => user.id)
		.notNull(),
	addressId: uuid("address_id").references(() => addresses.id),
	totalAmount: bigint("total_amount", { mode: "number" }).notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }),
	paymentStatus: varchar("payment_status", { length: 50 }).default("unpaid"),
	paymentReference: text("payment_reference"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Sub-Order per Seller ───────────────────────────────

export const orderSellers = pgTable("order_sellers", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderId: uuid("order_id")
		.references(() => orders.id, { onDelete: "cascade" })
		.notNull(),
	sellerStoreId: uuid("seller_store_id")
		.references(() => sellerStores.id)
		.notNull(),
	subtotal: bigint("subtotal", { mode: "number" }).notNull(),
	shippingCost: bigint("shipping_cost", { mode: "number" }).default(0),
	shippingMethod: varchar("shipping_method", { length: 100 }),
	trackingNumber: varchar("tracking_number", { length: 255 }),
	status: orderStatusEnum("status").notNull().default("pending_payment"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Order Line Items ───────────────────────────────────

export const orderItems = pgTable("order_items", {
	id: uuid("id").primaryKey().defaultRandom(),
	orderSellerId: uuid("order_seller_id")
		.references(() => orderSellers.id, { onDelete: "cascade" })
		.notNull(),
	variantId: varchar("variant_id", { length: 50 }).references(() => variants.id),
	productName: varchar("product_name", { length: 255 }),
	variantName: varchar("variant_name", { length: 255 }),
	quantity: integer("quantity").notNull(),
	price: bigint("price", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

// ─── Relations ──────────────────────────────────────────

export const ordersRelations = relations(orders, ({ one, many }) => ({
	buyer: one(user, { fields: [orders.buyerId], references: [user.id] }),
	address: one(addresses, {
		fields: [orders.addressId],
		references: [addresses.id],
	}),
	orderSellers: many(orderSellers),
}));

export const orderSellersRelations = relations(orderSellers, ({ one, many }) => ({
	order: one(orders, {
		fields: [orderSellers.orderId],
		references: [orders.id],
	}),
	sellerStore: one(sellerStores, {
		fields: [orderSellers.sellerStoreId],
		references: [sellerStores.id],
	}),
	items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	orderSeller: one(orderSellers, {
		fields: [orderItems.orderSellerId],
		references: [orderSellers.id],
	}),
	variant: one(variants, {
		fields: [orderItems.variantId],
		references: [variants.id],
	}),
}));

// ─── Types ──────────────────────────────────────────────

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderSeller = typeof orderSellers.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
