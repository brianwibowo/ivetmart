/**
 * Seller DB Queries — Ivet Mart
 *
 * Database query functions for seller dashboard operations:
 * - Store profile retrieval
 * - Seller product CRUD queries
 * - Seller order management queries
 * - Seller statistics
 */

import { and, count, eq, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderSellers, orders, products, sellerStores, user, variants } from "@/lib/db/schema";

/**
 * Get seller store by user ID
 */
export async function getSellerStoreByUserId(userId: string) {
	try {
		const rows = await db.select().from(sellerStores).where(eq(sellerStores.userId, userId)).limit(1);
		return rows[0] ?? null;
	} catch {
		return null;
	}
}

/**
 * Get seller store by slug (public store page)
 */
export async function getSellerStoreBySlug(slug: string) {
	const rows = await db
		.select()
		.from(sellerStores)
		.where(and(eq(sellerStores.slug, slug), eq(sellerStores.status, "active")))
		.limit(1);
	return rows[0] ?? null;
}

/**
 * Get seller products list
 */
export async function getSellerProducts(sellerStoreId: string) {
	try {
		const sellerProducts = await db.select().from(products).where(eq(products.sellerStoreId, sellerStoreId));

		const productIds = sellerProducts.map((p) => p.id);
		const productVariants = productIds.length ? await db.select().from(variants) : [];

		return sellerProducts.map((p) => ({
			...p,
			variants: productVariants.filter((v) => v.productId === p.id),
		}));
	} catch {
		return [];
	}
}

/**
 * Get seller dashboard overview statistics
 */
export async function getSellerStats(sellerStoreId: string) {
	try {
		const [totalProductsRes] = await db
			.select({ count: count() })
			.from(products)
			.where(eq(products.sellerStoreId, sellerStoreId));

		const [ordersRes] = await db
			.select({ count: count() })
			.from(orderSellers)
			.where(eq(orderSellers.sellerStoreId, sellerStoreId));

		const [revenueRes] = await db
			.select({ totalRevenue: sum(orderSellers.subtotal) })
			.from(orderSellers)
			.where(and(eq(orderSellers.sellerStoreId, sellerStoreId), eq(orderSellers.status, "completed")));

		return {
			totalProducts: Number(totalProductsRes?.count ?? 0),
			totalOrders: Number(ordersRes?.count ?? 0),
			totalRevenue: Number(revenueRes?.totalRevenue ?? 0),
		};
	} catch {
		return {
			totalProducts: 0,
			totalOrders: 0,
			totalRevenue: 0,
		};
	}
}

/**
 * Get orders assigned to a specific seller
 */
export async function getSellerOrders(sellerStoreId: string) {
	const subOrders = await db
		.select({
			subOrder: orderSellers,
			masterOrder: orders,
			buyer: user,
		})
		.from(orderSellers)
		.innerJoin(orders, eq(orderSellers.orderId, orders.id))
		.leftJoin(user, eq(orders.buyerId, user.id))
		.where(eq(orderSellers.sellerStoreId, sellerStoreId));

	return subOrders;
}
