/**
 * Buyer Server Actions — Ivet Mart
 *
 * Server-side actions for buyer account operations & checkout:
 * - Address management (create, delete, set default)
 * - Multi-vendor order creation & checkout
 */

"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { addresses, cartItems, orderItems, orderSellers, orders, products, variants } from "@/lib/db/schema";
import { safe } from "@/lib/utils";

/**
 * Add a new shipping address for buyer
 */
export async function createAddressAction(formData: FormData): Promise<void> {
	const session = await requireAuth();
	const userId = session.user.id;

	const label = (formData.get("label") as string) || "Rumah";
	const recipientName = formData.get("recipientName") as string;
	const phone = formData.get("phone") as string;
	const addressLine = formData.get("addressLine") as string;
	const city = (formData.get("city") as string) || "Semarang";
	const province = (formData.get("province") as string) || "Jawa Tengah";
	const postalCode = (formData.get("postalCode") as string) || null;
	const isDefault = formData.get("isDefault") === "true";

	if (!recipientName || !phone || !addressLine) {
		throw new Error("Nama penerima, nomor telepon, dan alamat wajib diisi.");
	}

	const [err] = await safe(
		db.transaction(async (tx) => {
			if (isDefault) {
				// Remove previous default
				await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
			}

			await tx.insert(addresses).values({
				userId,
				label,
				recipientName,
				phone,
				addressLine,
				city,
				province,
				postalCode,
				isDefault,
			});
		}),
	);

	if (err) {
		throw new Error("Gagal menyimpan alamat pengiriman.");
	}

	revalidatePath("/account/addresses");
	revalidatePath("/checkout");
}

/**
 * Delete a shipping address
 */
export async function deleteAddressAction(formData: FormData): Promise<void> {
	const session = await requireAuth();
	const addressId = formData.get("addressId") as string;

	if (!addressId) {
		throw new Error("ID Alamat wajib diisi.");
	}

	const [err] = await safe(
		db.delete(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, session.user.id))),
	);

	if (err) {
		throw new Error("Gagal menghapus alamat.");
	}

	revalidatePath("/account/addresses");
	revalidatePath("/checkout");
}

/**
 * Process Multi-Vendor Checkout
 * Groups items by seller store, creates master order + sub-orders per seller.
 */
export async function createOrderAction(formData: FormData): Promise<void> {
	const session = await requireAuth();
	const buyerId = session.user.id;

	const cartId = formData.get("cartId") as string;
	const addressId = formData.get("addressId") as string;
	const paymentMethod = (formData.get("paymentMethod") as string) || "transfer_bca";
	const notes = (formData.get("notes") as string) || null;

	if (!cartId) {
		throw new Error("Keranjang belanja kosong.");
	}

	// Fetch cart items with product & seller info
	const items = await db
		.select({
			cartItem: cartItems,
			variant: variants,
			product: products,
		})
		.from(cartItems)
		.innerJoin(variants, eq(cartItems.variantId, variants.id))
		.innerJoin(products, eq(variants.productId, products.id))
		.where(eq(cartItems.cartId, cartId));

	if (!items.length) {
		throw new Error("Keranjang belanja kosong.");
	}

	// Group items by sellerStoreId
	const itemsBySeller = new Map<
		string,
		{ variant: typeof variants.$inferSelect; product: typeof products.$inferSelect; quantity: number }[]
	>();

	let grandTotal = 0;

	items.forEach(({ cartItem, variant, product }) => {
		const sellerId = product.sellerStoreId || "official-store";
		if (!itemsBySeller.has(sellerId)) {
			itemsBySeller.set(sellerId, []);
		}
		itemsBySeller.get(sellerId)?.push({
			variant,
			product,
			quantity: cartItem.quantity,
		});
		grandTotal += Number(variant.price) * cartItem.quantity;
	});

	let createdOrderId = "";

	// Transaction to insert master order, sub-orders, order items, and clear cart
	const [err] = await safe(
		db.transaction(async (tx) => {
			const [masterOrder] = await tx
				.insert(orders)
				.values({
					buyerId,
					addressId: addressId || null,
					totalAmount: grandTotal,
					paymentMethod,
					paymentStatus: "unpaid",
					notes,
				})
				.returning();

			createdOrderId = masterOrder.id;

			for (const [sellerStoreId, sellerItems] of itemsBySeller.entries()) {
				const subtotal = sellerItems.reduce((sum, i) => sum + Number(i.variant.price) * i.quantity, 0);

				const isUuidSeller = sellerStoreId !== "official-store" && sellerStoreId.includes("-");

				// Insert sub-order per seller
				const [subOrder] = await tx
					.insert(orderSellers)
					.values({
						orderId: masterOrder.id,
						sellerStoreId: isUuidSeller ? sellerStoreId : "00000000-0000-0000-0000-000000000010",
						subtotal,
						shippingCost: 0,
						status: "pending_payment",
					})
					.returning();

				// Insert line items for this sub-order
				for (const item of sellerItems) {
					await tx.insert(orderItems).values({
						orderSellerId: subOrder.id,
						variantId: item.variant.id,
						productName: item.product.name,
						variantName: item.variant.name,
						quantity: item.quantity,
						price: Number(item.variant.price),
					});
				}
			}

			// Clear user's cart
			await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
		}),
	);

	if (err) {
		throw new Error("Gagal membuat pesanan.");
	}

	revalidatePath("/cart");
	revalidatePath("/account/orders");
	redirect(`/order/success/${createdOrderId}`);
}
