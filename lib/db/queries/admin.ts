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
import { categories, orders, products, sellerStores, users } from "@/lib/db/schema";

/**
 * Get overall admin dashboard statistics
 */
export async function getAdminDashboardStats() {
	try {
		const [totalUsers] = await db.select({ count: count() }).from(users);
		const [activeSellers] = await db
			.select({ count: count() })
			.from(sellerStores)
			.where(eq(sellerStores.status, "active"));
		const [pendingSellers] = await db
			.select({ count: count() })
			.from(sellerStores)
			.where(eq(sellerStores.status, "pending"));
		const [totalOrders] = await db.select({ count: count() }).from(orders);
		const [totalRevenue] = await db.select({ total: sum(orders.totalAmount) }).from(orders);

		return {
			totalUsers: Number(totalUsers?.count ?? 0),
			activeSellers: Number(activeSellers?.count ?? 0),
			pendingSellers: Number(pendingSellers?.count ?? 0),
			totalOrders: Number(totalOrders?.count ?? 0),
			totalRevenue: Number(totalRevenue?.total ?? 0),
		};
	} catch {
		return {
			totalUsers: 0,
			activeSellers: 0,
			pendingSellers: 0,
			totalOrders: 0,
			totalRevenue: 0,
		};
	}
}

/**
 * Get pending seller store approvals
 */
export async function getPendingSellers() {
	try {
		return await db
			.select({
				store: sellerStores,
				owner: users,
			})
			.from(sellerStores)
			.innerJoin(users, eq(sellerStores.userId, users.id))
			.where(eq(sellerStores.status, "pending"))
			.orderBy(desc(sellerStores.createdAt));
	} catch {
		return [];
	}
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
		await db.update(users).set({ role: "seller" }).where(eq(users.id, updated.userId));
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
	const allCategories = await db.select().from(categories);
	const productCounts = await db
		.select({
			categoryId: products.categoryId,
			count: count(),
		})
		.from(products)
		.groupBy(products.categoryId);

	const countMap = new Map(productCounts.map((p) => [p.categoryId, Number(p.count)]));

	return allCategories.map((cat) => ({
		...cat,
		productCount: countMap.get(cat.id) ?? 0,
	}));
}
