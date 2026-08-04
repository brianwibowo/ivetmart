/**
 * Admin DB Queries — Ivet Mart
 *
 * Database query functions for admin panel operations:
 * - Marketplace overall statistics
 * - User management
 * - Seller verification & approval
 * - Platform category management
 */

import { count, desc, eq, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, orders, products, sellerStores, user } from "@/lib/db/schema";
import { safe } from "@/lib/utils";

/**
 * Get overall admin dashboard statistics
 */
export async function getAdminDashboardStats() {
	const [err1, totalUsersRes] = await safe(db.select({ count: count() }).from(user));
	const [err2, activeSellersRes] = await safe(
		db.select({ count: count() }).from(sellerStores).where(eq(sellerStores.status, "active")),
	);
	const [err3, pendingSellersRes] = await safe(
		db.select({ count: count() }).from(sellerStores).where(eq(sellerStores.status, "pending")),
	);
	const [err4, totalOrdersRes] = await safe(db.select({ count: count() }).from(orders));
	const [err5, totalRevenueRes] = await safe(db.select({ total: sum(orders.totalAmount) }).from(orders));

	return {
		totalUsers: Number(totalUsersRes?.[0]?.count ?? 0),
		activeSellers: Number(activeSellersRes?.[0]?.count ?? 0),
		pendingSellers: Number(pendingSellersRes?.[0]?.count ?? 0),
		totalOrders: Number(totalOrdersRes?.[0]?.count ?? 0),
		totalRevenue: Number(totalRevenueRes?.[0]?.total ?? 0),
	};
}

/**
 * Get pending seller store approvals
 */
export async function getPendingSellers() {
	const [err, rows] = await safe(
		db
			.select({
				store: sellerStores,
				owner: user,
			})
			.from(sellerStores)
			.innerJoin(user, eq(sellerStores.userId, user.id))
			.where(eq(sellerStores.status, "pending"))
			.orderBy(desc(sellerStores.createdAt)),
	);

	if (err || !rows) return [];
	return rows;
}

/**
 * Approve seller store
 */
export async function approveSellerStore(storeId: string) {
	const [updated] = await db
		.update(sellerStores)
		.set({
			status: "active",
			verifiedAt: new Date(),
			updatedAt: new Date(),
		})
		.where(eq(sellerStores.id, storeId))
		.returning();

	if (updated) {
		// Update user role to seller if not already
		await db.update(user).set({ role: "seller" }).where(eq(user.id, updated.userId));
	}

	return updated;
}

/**
 * Reject seller store application
 */
export async function rejectSellerStore(storeId: string) {
	const [updated] = await db
		.update(sellerStores)
		.set({
			status: "rejected",
			updatedAt: new Date(),
		})
		.where(eq(sellerStores.id, storeId))
		.returning();
	return updated;
}

/**
 * Get all categories with product counts
 */
export async function getAllCategoriesWithCounts() {
	const [err, allCategories] = await safe(db.select().from(categories));
	if (err || !allCategories) return [];

	const [pErr, productCounts] = await safe(
		db
			.select({
				categoryId: products.categoryId,
				count: count(),
			})
			.from(products)
			.groupBy(products.categoryId),
	);

	const countsList = pErr || !productCounts ? [] : productCounts;
	const countMap = new Map(countsList.map((p) => [p.categoryId, Number(p.count)]));

	return allCategories.map((cat) => ({
		...cat,
		productCount: countMap.get(cat.id) ?? 0,
	}));
}
