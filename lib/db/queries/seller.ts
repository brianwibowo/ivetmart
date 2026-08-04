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
import { safe } from "@/lib/utils";

/**
 * Get seller store by user ID
 */
export async function getSellerStoreByUserId(userId: string) {
	const [err, rows] = await safe(
		db.select().from(sellerStores).where(eq(sellerStores.userId, userId)).limit(1),
	);
	if (err || !rows) return null;
	return rows[0] ?? null;
}

/**
 * Get seller store by slug (public store page)
 */
export async function getSellerStoreBySlug(slug: string) {
	const [err, rows] = await safe(
		db
			.select()
			.from(sellerStores)
			.where(and(eq(sellerStores.slug, slug), eq(sellerStores.status, "active")))
			.limit(1),
	);
	if (err || !rows) return null;
	return rows[0] ?? null;
}

/**
 * Get seller products list
 */
export async function getSellerProducts(sellerStoreId: string) {
	const [err, sellerProducts] = await safe(
		db.select().from(products).where(eq(products.sellerStoreId, sellerStoreId)),
	);
	if (err || !sellerProducts) return [];

	const productIds = sellerProducts.map((p) => p.id);
	const [vErr, productVariants] = productIds.length ? await safe(db.select().from(variants)) : [null, []];
	const variantsList = vErr || !productVariants ? [] : productVariants;

	return sellerProducts.map((p) => ({
		...p,
		variants: variantsList.filter((v) => v.productId === p.id),
	}));
}

/**
 * Get seller dashboard overview statistics
 */
export async function getSellerStats(sellerStoreId: string) {
	const [err1, totalProductsRes] = await safe(
		db.select({ count: count() }).from(products).where(eq(products.sellerStoreId, sellerStoreId)),
	);

	const [err2, ordersRes] = await safe(
		db.select({ count: count() }).from(orderSellers).where(eq(orderSellers.sellerStoreId, sellerStoreId)),
	);

	const [err3, revenueRes] = await safe(
		db
			.select({ totalRevenue: sum(orderSellers.subtotal) })
			.from(orderSellers)
			.where(and(eq(orderSellers.sellerStoreId, sellerStoreId), eq(orderSellers.status, "completed"))),
	);

	return {
		totalProducts: Number(totalProductsRes?.[0]?.count ?? 0),
		totalOrders: Number(ordersRes?.[0]?.count ?? 0),
		totalRevenue: Number(revenueRes?.[0]?.totalRevenue ?? 0),
	};
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

/**
 * Get all active seller stores with their product listings (for /store directory page)
 */
export async function getAllActiveStoresWithProducts() {
	try {
		const stores = await db.select().from(sellerStores).where(eq(sellerStores.status, "active"));

		const storeIds = stores.map((s) => s.id);
		const allProducts = storeIds.length ? await db.select().from(products) : [];
		const allVariants = allProducts.length ? await db.select().from(variants) : [];

		return stores.map((store) => {
			const storeProds = allProducts.filter((p) => p.sellerStoreId === store.id);
			const prodsWithVars = storeProds.map((p) => ({
				...p,
				variants: allVariants.filter((v) => v.productId === p.id),
			}));
			return {
				...store,
				products: prodsWithVars,
			};
		});
	} catch {
		return [];
	}
}
