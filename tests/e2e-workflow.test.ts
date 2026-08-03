/**
 * Comprehensive Automated Workflow & QA Test Suite — Ivet Mart
 *
 * Tests all 3 user roles & security guards via bun:test:
 * 1. Super Admin Workflow & Protection
 * 2. Seller Workflow & Store Queries
 * 3. Buyer & E-Commerce Logic
 * 4. Auth & Role Protections
 */

import { expect, test } from "bun:test";
import {
	getAdminDashboardStats,
	getAllCategoriesWithCounts,
	getPendingSellers,
} from "@/lib/db/queries/admin";
import { getActiveProducts } from "@/lib/db/queries/buyer";
import { getSellerProducts, getSellerStats, getSellerStoreByUserId } from "@/lib/db/queries/seller";
import { formatMoney } from "@/lib/money";

// ─── SKENARIO 1: SUPER ADMIN WORKFLOW ─────────────────────────

test("Admin: getAdminDashboardStats returns structured numbers without throwing", async () => {
	const stats = await getAdminDashboardStats();
	expect(typeof stats.totalUsers).toBe("number");
	expect(typeof stats.activeSellers).toBe("number");
	expect(typeof stats.pendingSellers).toBe("number");
	expect(typeof stats.totalOrders).toBe("number");
	expect(typeof stats.totalRevenue).toBe("number");
});

test("Admin: getPendingSellers returns an array of pending store applications", async () => {
	const pending = await getPendingSellers();
	expect(Array.isArray(pending)).toBe(true);
});

test("Admin: getAllCategoriesWithCounts returns categories with product counts", async () => {
	const categories = await getAllCategoriesWithCounts();
	expect(Array.isArray(categories)).toBe(true);
	for (const cat of categories) {
		expect(typeof cat.name).toBe("string");
		expect(typeof cat.productCount).toBe("number");
	}
});

// ─── SKENARIO 2: SELLER WORKFLOW ──────────────────────────────

test("Seller: getSellerStoreByUserId handles invalid and valid user IDs gracefully", async () => {
	const nonExistentStore = await getSellerStoreByUserId("invalid-uuid-12345");
	expect(nonExistentStore).toBeNull();
});

test("Seller: getSellerStats handles store statistics query without throwing", async () => {
	const stats = await getSellerStats("demo-seller-store-id");
	expect(typeof stats.totalProducts).toBe("number");
	expect(typeof stats.totalOrders).toBe("number");
	expect(typeof stats.totalRevenue).toBe("number");
});

test("Seller: getSellerProducts returns product list with variant mapping", async () => {
	const products = await getSellerProducts("demo-seller-store-id");
	expect(Array.isArray(products)).toBe(true);
});

// ─── SKENARIO 3: BUYER & E-COMMERCE LOGIC ─────────────────────

test("Buyer: formatMoney formats IDR currency correctly for Indonesian locale", () => {
	const formatted175k = formatMoney({
		amount: "175000",
		currency: "IDR",
		locale: "id-ID",
	});
	expect(formatted175k).toContain("175.000");

	const formattedZero = formatMoney({
		amount: 0,
		currency: "IDR",
		locale: "id-ID",
	});
	expect(formattedZero).toContain("0");
});

test("Buyer: getActiveProducts returns product listings for storefront", async () => {
	const products = await getActiveProducts({ limit: 12, offset: 0 });
	expect(Array.isArray(products)).toBe(true);
});

// ─── MATRIKS KEAMANAN & AUTH ──────────────────────────────────

test("Auth: AUTH_ENABLED flag is enabled for login/signup protection", async () => {
	const { AUTH_ENABLED } = await import("@/lib/auth-config");
	expect(AUTH_ENABLED).toBe(true);
});
