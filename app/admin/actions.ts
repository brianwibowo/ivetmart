/**
 * Admin Server Actions — Ivet Mart
 *
 * Server-side actions for platform administration:
 * - Approve / Reject pending seller stores
 * - Toggle user status (active / suspended)
 * - Moderate products (takedown / activate)
 * - Admin Product CRUD (create, update, delete across any store)
 * - Create new categories
 * - Update platform settings
 */

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { categories, platformSettings, products, sellerStores, users, variants } from "@/lib/db/schema";
import { safe } from "@/lib/utils";

/**
 * Approve a pending seller store
 */
export async function approveSellerAction(formData: FormData): Promise<void> {
	await requireAdmin();
	const storeId = formData.get("storeId") as string;

	if (!storeId) {
		throw new Error("ID Toko wajib diisi.");
	}

	const [store] = await db.select().from(sellerStores).where(eq(sellerStores.id, storeId)).limit(1);

	if (!store) {
		throw new Error("Toko tidak ditemukan.");
	}

	const [err] = await safe(
		db.transaction(async (tx) => {
			await tx
				.update(sellerStores)
				.set({
					status: "active",
					verifiedAt: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(sellerStores.id, storeId));

			await tx.update(users).set({ role: "seller" }).where(eq(users.id, store.userId));
		}),
	);

	if (err) {
		throw new Error("Gagal menyetujui toko.");
	}

	revalidatePath("/admin/sellers");
	revalidatePath("/admin");
}

/**
 * Reject a pending seller store application
 */
export async function rejectSellerAction(formData: FormData): Promise<void> {
	await requireAdmin();
	const storeId = formData.get("storeId") as string;

	if (!storeId) {
		throw new Error("ID Toko wajib diisi.");
	}

	const [err] = await safe(
		db
			.update(sellerStores)
			.set({
				status: "rejected",
				updatedAt: new Date(),
			})
			.where(eq(sellerStores.id, storeId)),
	);

	if (err) {
		throw new Error("Gagal menolak toko.");
	}

	revalidatePath("/admin/sellers");
	revalidatePath("/admin");
}

/**
 * Toggle user status (active / suspended)
 */
export async function toggleUserStatusAction(formData: FormData): Promise<void> {
	await requireAdmin();
	const userId = formData.get("userId") as string;
	const currentStatus = formData.get("currentStatus") as string;

	if (!userId) {
		throw new Error("ID User wajib diisi.");
	}

	const nextStatus = currentStatus === "active" ? "suspended" : "active";

	const [err] = await safe(
		db
			.update(users)
			.set({
				status: nextStatus as "active" | "suspended",
				updatedAt: new Date(),
			})
			.where(eq(users.id, userId)),
	);

	if (err) {
		throw new Error("Gagal mengubah status user.");
	}

	revalidatePath("/admin/users");
}

/**
 * Toggle product active status (Admin Moderation Takedown)
 */
export async function toggleProductActiveAction(formData: FormData): Promise<void> {
	await requireAdmin();
	const productId = formData.get("productId") as string;
	const currentActive = formData.get("currentActive") === "true";

	if (!productId) {
		throw new Error("ID Produk wajib diisi.");
	}

	const [err] = await safe(
		db
			.update(products)
			.set({
				active: !currentActive,
				updatedAt: new Date(),
			})
			.where(eq(products.id, productId)),
	);

	if (err) {
		throw new Error("Gagal mengubah status produk.");
	}

	revalidatePath("/admin/products");
	revalidatePath("/products");
}

/**
 * Admin Create Product (CRUD: Create product for any seller store or official store)
 */
export async function adminCreateProductAction(formData: FormData): Promise<void> {
	await requireAdmin();

	const name = formData.get("name") as string;
	const categoryId = formData.get("categoryId") as string;
	const sellerStoreId = (formData.get("sellerStoreId") as string) || null;
	const description = (formData.get("description") as string) || null;
	const summary = (formData.get("summary") as string) || null;
	const priceStr = formData.get("price") as string;
	const stockStr = formData.get("stock") as string;
	const imageUrl = (formData.get("imageUrl") as string) || "/products/lumpia-semarang.png";

	if (!name || !categoryId || !priceStr) {
		throw new Error("Nama, kategori, dan harga wajib diisi.");
	}

	const price = Number.parseInt(priceStr, 10);
	const stock = Number.parseInt(stockStr || "0", 10);

	const productId = `p-${Date.now()}`;
	const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

	const [err] = await safe(
		db.transaction(async (tx) => {
			await tx.insert(products).values({
				id: productId,
				sellerStoreId: sellerStoreId || null,
				name,
				slug,
				description,
				summary,
				categoryId,
				images: [imageUrl],
				active: true,
			});

			await tx.insert(variants).values({
				id: `v-${productId}-1`,
				productId,
				name: "Standard",
				price,
				stock,
				images: [imageUrl],
			});
		}),
	);

	if (err) {
		throw new Error("Gagal menambahkan produk oleh Admin.");
	}

	revalidatePath("/admin/products");
	revalidatePath("/products");
}

/**
 * Admin Delete Product (CRUD: Delete product permanently)
 */
export async function adminDeleteProductAction(formData: FormData): Promise<void> {
	await requireAdmin();
	const productId = formData.get("productId") as string;

	if (!productId) {
		throw new Error("ID Produk wajib diisi.");
	}

	const [err] = await safe(db.delete(products).where(eq(products.id, productId)));

	if (err) {
		throw new Error("Gagal menghapus produk.");
	}

	revalidatePath("/admin/products");
	revalidatePath("/products");
}

/**
 * Create a new product category
 */
export async function createCategoryAction(formData: FormData): Promise<void> {
	await requireAdmin();
	const name = formData.get("name") as string;
	const description = (formData.get("description") as string) || null;

	if (!name || name.trim().length < 2) {
		throw new Error("Nama kategori minimal 2 karakter.");
	}

	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	const id = `cat-${slug}`;

	const [err] = await safe(
		db.insert(categories).values({
			id,
			name,
			slug,
			description,
			active: true,
		}),
	);

	if (err) {
		throw new Error("Gagal menambahkan kategori. ID/Slug mungkin sudah ada.");
	}

	revalidatePath("/admin/categories");
	revalidatePath("/products");
}

/**
 * Update platform settings
 */
export async function updatePlatformSettingsAction(formData: FormData): Promise<void> {
	await requireAdmin();
	const storeName = formData.get("storeName") as string;
	const announcementBar = formData.get("announcementBar") as string;

	if (storeName) {
		await db
			.insert(platformSettings)
			.values({ key: "store_name", value: storeName, updatedAt: new Date() })
			.onConflictDoUpdate({ target: platformSettings.key, set: { value: storeName, updatedAt: new Date() } });
	}

	if (announcementBar !== null) {
		await db
			.insert(platformSettings)
			.values({ key: "announcement_bar", value: announcementBar, updatedAt: new Date() })
			.onConflictDoUpdate({
				target: platformSettings.key,
				set: { value: announcementBar, updatedAt: new Date() },
			});
	}

	revalidatePath("/admin/settings");
	revalidatePath("/");
}
