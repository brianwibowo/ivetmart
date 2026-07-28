/**
 * Admin Server Actions — Ivet Mart
 *
 * Server-side actions for platform administration.
 * All actions return { success, message } for toast feedback.
 */

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { categories, platformSettings, products, sellerStores, users, variants } from "@/lib/db/schema";
import { safe } from "@/lib/utils";

type ActionResult = { success: boolean; message: string };

/**
 * Approve a pending seller store
 */
export async function approveSellerAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
	await requireAdmin();
	const storeId = formData.get("storeId") as string;

	if (!storeId) {
		return { success: false, message: "ID Toko wajib diisi." };
	}

	const [store] = await db.select().from(sellerStores).where(eq(sellerStores.id, storeId)).limit(1);

	if (!store) {
		return { success: false, message: "Toko tidak ditemukan." };
	}

	const [err] = await safe(
		db.transaction(async (tx) => {
			await tx
				.update(sellerStores)
				.set({ status: "active", verifiedAt: new Date(), updatedAt: new Date() })
				.where(eq(sellerStores.id, storeId));
			await tx.update(users).set({ role: "seller" }).where(eq(users.id, store.userId));
		}),
	);

	if (err) {
		return { success: false, message: "Gagal menyetujui toko." };
	}

	revalidatePath("/admin/sellers");
	revalidatePath("/admin");
	return { success: true, message: `Toko "${store.name}" berhasil disetujui!` };
}

/**
 * Reject a pending seller store
 */
export async function rejectSellerAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
	await requireAdmin();
	const storeId = formData.get("storeId") as string;

	if (!storeId) {
		return { success: false, message: "ID Toko wajib diisi." };
	}

	const [err] = await safe(
		db
			.update(sellerStores)
			.set({ status: "rejected", updatedAt: new Date() })
			.where(eq(sellerStores.id, storeId)),
	);

	if (err) {
		return { success: false, message: "Gagal menolak toko." };
	}

	revalidatePath("/admin/sellers");
	revalidatePath("/admin");
	return { success: true, message: "Pengajuan toko telah ditolak." };
}

/**
 * Toggle user status (active / suspended)
 */
export async function toggleUserStatusAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
	await requireAdmin();
	const userId = formData.get("userId") as string;
	const currentStatus = formData.get("currentStatus") as string;

	if (!userId) {
		return { success: false, message: "ID User wajib diisi." };
	}

	const nextStatus = currentStatus === "active" ? "suspended" : "active";

	const [err] = await safe(
		db
			.update(users)
			.set({ status: nextStatus as "active" | "suspended", updatedAt: new Date() })
			.where(eq(users.id, userId)),
	);

	if (err) {
		return { success: false, message: "Gagal mengubah status user." };
	}

	revalidatePath("/admin/users");
	return {
		success: true,
		message: nextStatus === "suspended" ? "User berhasil disuspend." : "User berhasil diaktifkan kembali.",
	};
}

/**
 * Toggle product active status (Admin Moderation Takedown)
 */
export async function toggleProductActiveAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	await requireAdmin();
	const productId = formData.get("productId") as string;
	const currentActive = formData.get("currentActive") === "true";

	if (!productId) {
		return { success: false, message: "ID Produk wajib diisi." };
	}

	const [err] = await safe(
		db
			.update(products)
			.set({ active: !currentActive, updatedAt: new Date() })
			.where(eq(products.id, productId)),
	);

	if (err) {
		return { success: false, message: "Gagal mengubah status produk." };
	}

	revalidatePath("/admin/products");
	revalidatePath("/products");
	return {
		success: true,
		message: currentActive ? "Produk di-takedown dari katalog publik." : "Produk diaktifkan kembali.",
	};
}

/**
 * Admin Create Product
 */
export async function adminCreateProductAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
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
		return { success: false, message: "Nama, kategori, dan harga wajib diisi." };
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
		return { success: false, message: "Gagal menambahkan produk." };
	}

	revalidatePath("/admin/products");
	revalidatePath("/products");
	return { success: true, message: `Produk "${name}" berhasil ditambahkan!` };
}

/**
 * Admin Delete Product
 */
export async function adminDeleteProductAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	await requireAdmin();
	const productId = formData.get("productId") as string;

	if (!productId) {
		return { success: false, message: "ID Produk wajib diisi." };
	}

	const [err] = await safe(db.delete(products).where(eq(products.id, productId)));

	if (err) {
		return { success: false, message: "Gagal menghapus produk." };
	}

	revalidatePath("/admin/products");
	revalidatePath("/products");
	return { success: true, message: "Produk berhasil dihapus dari platform." };
}

/**
 * Create a new product category
 */
export async function createCategoryAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
	await requireAdmin();
	const name = formData.get("name") as string;
	const description = (formData.get("description") as string) || null;

	if (!name || name.trim().length < 2) {
		return { success: false, message: "Nama kategori minimal 2 karakter." };
	}

	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	const id = `cat-${slug}`;

	const [err] = await safe(db.insert(categories).values({ id, name, slug, description, active: true }));

	if (err) {
		return { success: false, message: "Gagal menambahkan kategori. Slug mungkin sudah ada." };
	}

	revalidatePath("/admin/categories");
	revalidatePath("/products");
	return { success: true, message: `Kategori "${name}" berhasil ditambahkan!` };
}

/**
 * Update platform settings
 */
export async function updatePlatformSettingsAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
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
	return { success: true, message: "Pengaturan platform berhasil diperbarui!" };
}
