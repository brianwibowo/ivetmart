/**
 * Buyer DB Queries — Ivet Mart
 *
 * Database query functions for buyer operations:
 * - Product browsing & search
 * - Cart operations
 * - Buyer addresses & wishlist
 */

import { and, eq, ilike, inArray, type SQL, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems, carts, categories, products, sellerStores, variants } from "@/lib/db/schema";

/**
 * Fetch list of active products with optional filters
 */
export async function getActiveProducts(options?: {
	limit?: number;
	offset?: number;
	search?: string;
	category?: string;
	collection?: string;
}) {
	try {
		const limit = options?.limit ?? 50;
		const offset = options?.offset ?? 0;

		const whereConditions: (SQL | undefined)[] = [eq(products.active, true)];

		if (options?.search) {
			whereConditions.push(ilike(products.name, `%${options.search.toLowerCase()}%`));
		}

		if (options?.category) {
			whereConditions.push(eq(products.categoryId, options.category));
		}

		const rows = await db
			.select({
				product: products,
				category: categories,
				sellerStore: sellerStores,
			})
			.from(products)
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(sellerStores, eq(products.sellerStoreId, sellerStores.id))
			.where(and(...whereConditions))
			.limit(limit)
			.offset(offset);

		// Fetch variants for each product
		const productIds = rows.map((r) => r.product.id);
		const productVariants = productIds.length
			? await db.select().from(variants).where(inArray(variants.productId, productIds))
			: [];

		return rows.map(({ product, category, sellerStore }) => ({
			...product,
			images: (product.images as string[]) ?? [],
			category: category ? { id: category.id, name: category.name, slug: category.slug } : undefined,
			seller: sellerStore
				? {
						id: sellerStore.id,
						name: sellerStore.name,
						slug: sellerStore.slug,
						logoUrl: sellerStore.logoUrl,
					}
				: undefined,
			variants: productVariants
				.filter((v) => v.productId === product.id)
				.map((v) => ({
					id: v.id,
					productId: v.productId ?? product.id,
					name: v.name ?? "",
					price: String(v.price),
					stock: v.stock ?? 0,
					images: (v.images as string[]) ?? [],
					attributes: (v.attributes as Record<string, string>) ?? {},
				})),
		}));
	} catch {
		return [];
	}
}

/**
 * Get product details by ID or Slug
 */
export async function getProductByIdOrSlug(idOrSlug: string) {
	const row = await db
		.select({
			product: products,
			category: categories,
			sellerStore: sellerStores,
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.leftJoin(sellerStores, eq(products.sellerStoreId, sellerStores.id))
		.where(
			and(eq(products.active, true), sql`(${products.id} = ${idOrSlug} OR ${products.slug} = ${idOrSlug})`),
		)
		.limit(1);

	if (!row.length) return null;

	const { product, category, sellerStore } = row[0];

	const itemVariants = await db.select().from(variants).where(eq(variants.productId, product.id));

	return {
		...product,
		images: (product.images as string[]) ?? [],
		category: category ? { id: category.id, name: category.name, slug: category.slug } : undefined,
		seller: sellerStore
			? {
					id: sellerStore.id,
					name: sellerStore.name,
					slug: sellerStore.slug,
					logoUrl: sellerStore.logoUrl,
				}
			: undefined,
		variants: itemVariants.map((v) => ({
			id: v.id,
			productId: v.productId ?? product.id,
			name: v.name ?? "",
			price: String(v.price),
			stock: v.stock ?? 0,
			images: (v.images as string[]) ?? [],
			attributes: (v.attributes as Record<string, string>) ?? {},
		})),
	};
}

/**
 * Get shopping cart contents
 */
export async function getCart(cartId: string) {
	const cartRow = await db.select().from(carts).where(eq(carts.id, cartId)).limit(1);
	if (!cartRow.length) return null;

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

	const formattedItems = items.map(({ cartItem, variant, product }) => ({
		id: `item-${variant.id}`,
		variantId: variant.id,
		quantity: cartItem.quantity,
		variant: {
			id: variant.id,
			productId: product.id,
			name: variant.name ?? "",
			price: String(variant.price),
			stock: variant.stock ?? 0,
			images: (variant.images as string[]) ?? [],
			attributes: (variant.attributes as Record<string, string>) ?? {},
		},
		product: {
			id: product.id,
			name: product.name,
			slug: product.slug,
			images: (product.images as string[]) ?? [],
		},
	}));

	const totalAmount = formattedItems
		.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0)
		.toString();

	return {
		id: cartId,
		items: formattedItems,
		lineItems: formattedItems,
		totalAmount,
	};
}
