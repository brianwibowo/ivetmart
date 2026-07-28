/**
 * Seller Server Actions — Ivet Mart
 *
 * Server-side actions for seller onboarding and store management.
 * Actions that stay on page return { success, message } for toast feedback.
 * Actions that redirect (registerStore, createProduct) keep void return + redirect().
 */

"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requireSeller } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { getSellerStoreByUserId } from "@/lib/db/queries/seller";
import { orderSellers, products, sellerStores, variants } from "@/lib/db/schema";
import { safe } from "@/lib/utils";

type ActionResult = { success: boolean; message: string };

/**
 * Register a new seller store (redirects → keeps void)
 */
export async function registerSellerStoreAction(formData: FormData): Promise<void> {
	const session = await requireAuth();
	const userId = session.user.id;

	const name = formData.get("name") as string;
	const description = (formData.get("description") as string) || null;
	const address = (formData.get("address") as string) || null;
	const city = (formData.get("city") as string) || null;
	const province = (formData.get("province") as string) || null;
	const postalCode = (formData.get("postalCode") as string) || null;
	const phone = (formData.get("phone") as string) || null;

	if (!name || name.trim().length < 3) {
		throw new Error("Nama toko minimal 3 karakter.");
	}

	const baseSlug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

	const [err] = await safe(
		db
			.insert(sellerStores)
			.values({
				userId,
				name,
				slug,
				description,
				address,
				city,
				province,
				postalCode,
				phone,
				status: "pending",
			})
			.returning(),
	);

	if (err) {
		throw new Error("Gagal mendaftarkan toko. Silakan coba lagi.");
	}

	revalidatePath("/seller");
	redirect("/seller/pending");
}

/**
 * Update store settings (stays on page → returns ActionResult)
 */
export async function updateStoreSettingsAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (!store) {
		return { success: false, message: "Toko tidak ditemukan." };
	}

	const name = formData.get("name") as string;
	const description = (formData.get("description") as string) || null;
	const address = (formData.get("address") as string) || null;
	const city = (formData.get("city") as string) || null;
	const province = (formData.get("province") as string) || null;
	const phone = (formData.get("phone") as string) || null;

	if (!name || name.trim().length < 3) {
		return { success: false, message: "Nama toko minimal 3 karakter." };
	}

	const [err] = await safe(
		db
			.update(sellerStores)
			.set({ name, description, address, city, province, phone, updatedAt: new Date() })
			.where(eq(sellerStores.id, store.id)),
	);

	if (err) {
		return { success: false, message: "Gagal memperbarui toko." };
	}

	revalidatePath("/seller/settings");
	return { success: true, message: "Pengaturan toko berhasil disimpan!" };
}

/**
 * Create a new product for seller store (redirects → keeps void)
 */
export async function createProductAction(formData: FormData): Promise<void> {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (store?.status !== "active") {
		throw new Error("Toko Anda belum disetujui oleh Admin.");
	}

	const name = formData.get("name") as string;
	const categoryId = formData.get("categoryId") as string;
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
				sellerStoreId: store.id,
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
		throw new Error("Gagal menambahkan produk.");
	}

	revalidatePath("/seller/products");
	revalidatePath("/products");
	redirect("/seller/products");
}

/**
 * Update order tracking number and status (stays on page → returns ActionResult)
 */
export async function updateOrderShippingAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (!store) {
		return { success: false, message: "Toko tidak ditemukan." };
	}

	const subOrderId = formData.get("subOrderId") as string;
	const trackingNumber = (formData.get("trackingNumber") as string) || null;
	const status = formData.get("status") as "processing" | "shipped" | "delivered" | "completed";

	if (!subOrderId || !status) {
		return { success: false, message: "ID Pesanan dan Status wajib diisi." };
	}

	const [err] = await safe(
		db
			.update(orderSellers)
			.set({ trackingNumber, status, updatedAt: new Date() })
			.where(and(eq(orderSellers.id, subOrderId), eq(orderSellers.sellerStoreId, store.id))),
	);

	if (err) {
		return { success: false, message: "Gagal memperbarui status pesanan." };
	}

	revalidatePath("/seller/orders");
	return { success: true, message: "Status pesanan & resi berhasil diperbarui!" };
}
