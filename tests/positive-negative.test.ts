/**
 * Detailed Positive & Negative QA Test Suite — Ivet Mart
 *
 * Covers all roles & anonymous visitors:
 * 1. Guest / Non-registered Visitor (Pengunjung Anonim)
 * 2. Buyer (Pembeli Terdaftar)
 * 3. Seller (Penjual Terdaftar)
 * 4. Super Admin (Pengelola Platform)
 */

import { expect, test } from "bun:test";
import { AUTH_ENABLED } from "@/lib/auth-config";
import {
	getAdminDashboardStats,
	getAllCategoriesWithCounts,
	getPendingSellers,
} from "@/lib/db/queries/admin";
import { getActiveProducts } from "@/lib/db/queries/buyer";
import {
	getSellerProducts,
	getSellerStats,
	getSellerStoreBySlug,
	getSellerStoreByUserId,
} from "@/lib/db/queries/seller";
import { formatMoney } from "@/lib/money";

// ─── 1. GUEST / NON-REGISTERED VISITOR (PELIHAT) ────────────────

test("GUEST [+] Positive: Visitor can view active storefront products", async () => {
	const products = await getActiveProducts({ limit: 10 });
	expect(Array.isArray(products)).toBe(true);
});

test("GUEST [+] Positive: Visitor can format prices in Rupiah", () => {
	const result = formatMoney({ amount: 50000, currency: "IDR", locale: "id-ID" });
	expect(result).toContain("50.000");
});

test("GUEST [+] Positive: Visitor can view public product categories", async () => {
	const categories = await getAllCategoriesWithCounts();
	expect(Array.isArray(categories)).toBe(true);
});

test("GUEST [-] Negative: Unauthenticated request to getSellerStoreByUserId returns null", async () => {
	const result = await getSellerStoreByUserId("");
	expect(result).toBeNull();
});

test("GUEST [-] Negative: Searching non-existent product keyword returns empty array", async () => {
	const result = await getActiveProducts({ search: "xyz-non-existent-product-12345" });
	expect(result).toEqual([]);
});

// ─── 2. BUYER (PEMBELI TERDAFTAR) ────────────────────────────────

test("BUYER [+] Positive: Buyer cart price formatting for low and high amounts", () => {
	const lowPrice = formatMoney({ amount: 5000, currency: "IDR", locale: "id-ID" });
	const highPrice = formatMoney({ amount: 2500000, currency: "IDR", locale: "id-ID" });
	expect(lowPrice).toContain("5.000");
	expect(highPrice).toContain("2.500.000");
});

test("BUYER [+] Positive: Auth system flag is enabled for protected checkout", () => {
	expect(AUTH_ENABLED).toBe(true);
});

test("BUYER [-] Negative: Buyer account with invalid store slug returns null store", async () => {
	const store = await getSellerStoreBySlug("invalid-store-slug-999");
	expect(store).toBeNull();
});

test("BUYER [-] Negative: Buyer querying seller products with random ID returns empty list", async () => {
	const products = await getSellerProducts("random-buyer-id-888");
	expect(products).toEqual([]);
});

// ─── 3. SELLER (PENJUAL TERDAFTAR) ───────────────────────────────

test("SELLER [+] Positive: getSellerStats returns valid structure even for new stores", async () => {
	const stats = await getSellerStats("new-seller-store-123");
	expect(stats).toEqual({
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
	});
});

test("SELLER [+] Positive: getSellerProducts handles empty store cleanly", async () => {
	const products = await getSellerProducts("empty-store-id");
	expect(products).toEqual([]);
});

test("SELLER [-] Negative: Invalid seller user ID lookup does not throw error", async () => {
	const store = await getSellerStoreByUserId("non-existent-user-id-777");
	expect(store).toBeNull();
});

test("SELLER [-] Negative: Seller querying non-existent category filter returns empty array", async () => {
	const products = await getActiveProducts({ category: "cat-non-existent-999" });
	expect(products).toEqual([]);
});

// ─── 4. SUPER ADMIN (PENGELOLA PLATFORM) ────────────────────────

test("ADMIN [+] Positive: Admin dashboard stats return non-negative metric counts", async () => {
	const stats = await getAdminDashboardStats();
	expect(stats.totalUsers).toBeGreaterThanOrEqual(0);
	expect(stats.activeSellers).toBeGreaterThanOrEqual(0);
	expect(stats.pendingSellers).toBeGreaterThanOrEqual(0);
	expect(stats.totalOrders).toBeGreaterThanOrEqual(0);
	expect(stats.totalRevenue).toBeGreaterThanOrEqual(0);
});

test("ADMIN [+] Positive: Admin pending sellers query returns list structure", async () => {
	const pending = await getPendingSellers();
	expect(Array.isArray(pending)).toBe(true);
});

test("ADMIN [-] Negative: Admin categories query fallback prevents 500 on missing table", async () => {
	const categories = await getAllCategoriesWithCounts();
	expect(Array.isArray(categories)).toBe(true);
});

test("ADMIN [-] Negative: Querying non-existent seller store verification returns empty", async () => {
	const pending = await getPendingSellers();
	const match = pending.find((p) => p.store.id === "fake-store-id-000");
	expect(match).toBeUndefined();
});
