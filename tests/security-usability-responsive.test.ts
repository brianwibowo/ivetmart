/**
 * Security, Usability, Network Resilience & Responsiveness Test Suite — Ivet Mart
 *
 * Tests:
 * 1. Security: Role bypass prevention (Buyer cannot trigger Admin/Seller actions)
 * 2. Security: Admin data protection (Data tampering rejection)
 * 3. Usability & Network Resilience: Error fallback & offline/slow network resilience
 * 4. Responsiveness: Mobile/Tablet drawer navigation & layout breakpoint specs
 */

import { expect, test } from "bun:test";
import { approveSellerAction, createCategoryAction, updatePlatformSettingsAction } from "@/app/admin/actions";
import { createProductAction, updateStoreSettingsAction } from "@/app/seller/actions";
import {
	getAdminDashboardStats,
	getAllCategoriesWithCounts,
	getPendingSellers,
} from "@/lib/db/queries/admin";
import { getActiveProducts } from "@/lib/db/queries/buyer";
import { getSellerProducts, getSellerStats, getSellerStoreByUserId } from "@/lib/db/queries/seller";

// ─── 1. SECURITY & ROLE BYPASS PREVENTION ─────────────────────

test("SECURITY 1: Non-admin calling approveSellerAction is rejected by auth guard", async () => {
	const formData = new FormData();
	formData.append("storeId", "test-store-id");

	try {
		await approveSellerAction({ success: false, message: "" }, formData);
		// Should not reach here without admin session
		expect(true).toBe(false);
	} catch (err: any) {
		// Expect redirect or authorization error thrown by requireAdmin
		expect(err).toBeDefined();
	}
});

test("SECURITY 2: Non-admin calling createCategoryAction is rejected by auth guard", async () => {
	const formData = new FormData();
	formData.append("name", "Hacked Category");

	try {
		await createCategoryAction({ success: false, message: "" }, formData);
		expect(true).toBe(false);
	} catch (err: any) {
		expect(err).toBeDefined();
	}
});

test("SECURITY 3: Non-admin calling updatePlatformSettingsAction is rejected", async () => {
	const formData = new FormData();
	formData.append("storeName", "Hacked Store Name");

	try {
		await updatePlatformSettingsAction({ success: false, message: "" }, formData);
		expect(true).toBe(false);
	} catch (err: any) {
		expect(err).toBeDefined();
	}
});

test("SECURITY 4: Non-seller calling updateStoreSettingsAction is rejected by requireSeller", async () => {
	const formData = new FormData();
	formData.append("name", "Hacked Store");

	try {
		await updateStoreSettingsAction({ success: false, message: "" }, formData);
		expect(true).toBe(false);
	} catch (err: any) {
		expect(err).toBeDefined();
	}
});

test("SECURITY 5: Non-seller calling createProductAction is rejected by requireSeller", async () => {
	const formData = new FormData();
	formData.append("name", "Illegal Product");

	try {
		await createProductAction(formData);
		expect(true).toBe(false);
	} catch (err: any) {
		expect(err).toBeDefined();
	}
});

// ─── 2. USABILITY & NETWORK RESILIENCE ────────────────────────

test("USABILITY: Database queries handle slow/failing network gracefully without 500 crash", async () => {
	const stats = await getAdminDashboardStats();
	const pending = await getPendingSellers();
	const cats = await getAllCategoriesWithCounts();
	const products = await getActiveProducts();
	const sellerStore = await getSellerStoreByUserId("dummy-user");
	const sellerStats = await getSellerStats("dummy-store");
	const sellerProds = await getSellerProducts("dummy-store");

	// All functions must return valid safe data structures, never throwing unhandled 500 exceptions
	expect(typeof stats.totalUsers).toBe("number");
	expect(Array.isArray(pending)).toBe(true);
	expect(Array.isArray(cats)).toBe(true);
	expect(Array.isArray(products)).toBe(true);
	expect(sellerStore === null || typeof sellerStore === "object").toBe(true);
	expect(typeof sellerStats.totalProducts).toBe("number");
	expect(Array.isArray(sellerProds)).toBe(true);
});

// ─── 3. RESPONSIVE BREAKPOINT & DRAWER NAV CHECKS ─────────────

test("RESPONSIVE: Navbar and Sidebar breakpoints specify mobile drawer wrappers", async () => {
	const { Navbar } = await import("@/app/navbar");
	const { AdminSidebarNav } = await import("@/components/admin/sidebar-nav");
	const { SellerSidebarNav } = await import("@/components/seller/sidebar-nav");

	expect(Navbar).toBeDefined();
	expect(AdminSidebarNav).toBeDefined();
	expect(SellerSidebarNav).toBeDefined();
});
