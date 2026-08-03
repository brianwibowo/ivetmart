// Database-Backed Data Access Layer for Ivet Mart
// Queries PostgreSQL via Drizzle ORM — 0 external API key dependencies

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { getActiveProducts, getProductByIdOrSlug } from "@/lib/db/queries/buyer";
import {
	cartItems,
	carts,
	categories,
	collections,
	products,
	reviews,
	user,
	variants,
} from "@/lib/db/schema";

export type LocalVariant = {
	id: string;
	productId: string;
	name: string;
	price: string;
	stock: number;
	images: string[];
	attributes: Record<string, string>;
	combinations?: Record<string, string>;
	originalPrice?: string;
	sku?: string;
	omnibusPrice?: string;
};

export type LocalProductCategory = {
	id: string;
	name: string;
	slug: string;
};

export type LocalProductSeller = {
	id: string;
	name: string;
	slug: string;
	logoUrl?: string | null;
};

export type VolumeTier = {
	id: string;
	price: string;
	minQuantity: number;
	maxQuantity: number | null;
	productVariantId: string;
};

export type LocalProduct = {
	id: string;
	name: string;
	slug: string;
	description: string;
	summary?: string;
	content?: Record<string, unknown> | null;
	categoryId: string;
	category?: LocalProductCategory;
	seller?: LocalProductSeller;
	images: string[];
	active: boolean;
	variants: LocalVariant[];
	volumePricingTiers?: VolumeTier[];
	updatedAt: string;
	seo?: { title?: string; description?: string; canonical?: string };
};

export type LocalCategory = {
	id: string;
	name: string;
	slug: string;
	parentId?: string | null;
	description: string;
	active?: boolean;
	image?: string;
	seo?: { title?: string; description?: string; canonical?: string };
};

export type LocalCollection = {
	id: string;
	name: string;
	slug: string;
	description: string;
	createdAt?: string;
	active?: boolean;
	image?: string;
	seo?: { title?: string; description?: string; canonical?: string };
};

export type LocalPost = {
	id: string;
	title: string;
	slug: string;
	tag?: string;
	summary?: string;
	content?: Record<string, unknown> | null;
	image?: string;
	active?: boolean;
	publishedAt: string;
	createdAt: string;
	updatedAt?: string;
	seo?: { title?: string; description?: string; canonical?: string };
};

export type LocalCartItem = {
	id: string;
	variantId: string;
	quantity: number;
	variant: LocalVariant;
	productVariant: {
		id: string;
		price: string;
		images: string[];
		product: {
			id: string;
			name: string;
			slug: string;
			images: string[];
		};
	};
	product: LocalProduct;
};

export type LocalCart = {
	id: string;
	items: LocalCartItem[];
	lineItems: LocalCartItem[];
	totalAmount: string;
};

export type NewsletterPopupSettings = {
	delaySeconds?: number;
	heading?: string;
	subheading?: string;
	ctaText?: string;
	teaserText?: string;
	imageUrl?: string;
	discountCode?: string;
};

export const STORE_INFO = {
	store: {
		id: "store-ivetmart",
		name: "Ivet Mart",
		subdomain: "ivetmart",
		currency: "IDR",
		settings: {
			storeDescription:
				"Marketplace resmi civitas Universitas Ivet Semarang — Menghadirkan produk khas Semarang dan merchandise eksklusif UNISVET.",
			logo: { imageUrl: "/logo.png" },
			favicon: { imageUrl: "/logo.png" },
			ogimage: "/logo.png",
			defaultLanguage: "id-ID",
			enabledTools: {
				blog: true,
				newsletterPopup: false,
				contactForm: true,
				reviews: true,
				cookieConsent: false,
			},
			newsletterPopup: null as NewsletterPopupSettings | null,
			announcementBar: "Selamat Datang di Ivet Mart — Pusat Produk Khas Semarang & Merchandise Resmi UNISVET",
		},
	},
	publicUrl: getCanonicalUrl(),
};

export const commerce = {
	meGet: async () => STORE_INFO,

	productBrowse: async (options?: {
		active?: boolean;
		limit?: number;
		offset?: number;
		search?: string;
		query?: string;
		category?: string;
		collection?: string;
		brand?: string;
		priceMin?: number;
		priceMax?: number;
		vts?: unknown;
		tags?: string[];
		orderBy?: string;
		orderDirection?: string;
	}) => {
		const searchKeyword = options?.query || options?.search;
		const list = await getActiveProducts({
			limit: options?.limit,
			offset: options?.offset,
			search: searchKeyword,
			category: options?.category,
			collection: options?.collection,
		});

		const enrichedList = list.map((p) => ({
			...p,
			description: p.description ?? "",
			summary: p.summary ?? undefined,
			categoryId: p.categoryId ?? "",
			updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
		}));

		return {
			data: enrichedList as LocalProduct[],
			meta: { total: enrichedList.length, count: enrichedList.length, pagesCount: 1 },
		};
	},

	productGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		const product = await getProductByIdOrSlug(idOrSlug);
		if (!product) return null;

		return {
			...product,
			description: product.description ?? "",
			summary: product.summary ?? undefined,
			categoryId: product.categoryId ?? "",
			updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
		} as LocalProduct;
	},

	productFilters: async () => {
		const dbCats = await db.select().from(categories);
		return {
			categories: dbCats.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
			tags: ["Semarang", "UNISVET", "Kuliner", "Batik", "Merchandise"],
			price: { min: "38000", max: "215000" },
			priceBounds: { min: 38000, max: 215000 },
			variantTypes: [],
			collections: [],
			brands: [],
		};
	},

	productReviewsBrowse: async ({ idOrSlug }: { idOrSlug: string }, _options?: { limit?: number }) => {
		const product = await getProductByIdOrSlug(idOrSlug);
		if (!product) {
			return {
				data: [],
				summary: { averageRating: 5, totalCount: 0, reviewCount: 0 },
				meta: { averageRating: 5, totalCount: 0, count: 0, offset: 0, limit: 20 },
			};
		}

		const dbReviews = await db
			.select({
				review: reviews,
				user: user,
			})
			.from(reviews)
			.leftJoin(user, eq(reviews.userId, user.id))
			.where(eq(reviews.productId, product.id));

		const formattedReviews = dbReviews.map(({ review, user }) => ({
			id: review.id,
			author: user?.name ?? "Pembeli",
			content: review.comment ?? "",
			rating: review.rating,
			createdAt: review.createdAt ? new Date(review.createdAt).toISOString() : new Date().toISOString(),
		}));

		const avg = formattedReviews.length
			? formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length
			: 5;

		return {
			data: formattedReviews,
			summary: {
				averageRating: avg,
				totalCount: formattedReviews.length,
				reviewCount: formattedReviews.length,
			},
			meta: {
				averageRating: avg,
				totalCount: formattedReviews.length,
				count: formattedReviews.length,
				offset: 0,
				limit: 20,
			},
		};
	},

	productReviewCreate: async (_arg1?: unknown, _arg2?: unknown) => {
		return { success: true };
	},

	categoriesBrowse: async (options?: { active?: boolean; limit?: number }) => {
		let query = db.select().from(categories);
		if (options?.limit) {
			query = query.limit(options.limit) as typeof query;
		}
		const list = await query;
		return {
			data: list.map((c) => ({
				...c,
				description: c.description ?? "",
				parentId: null as string | null,
				active: c.active ?? true,
				image: c.image ?? undefined,
				seo: { title: c.name, description: c.description ?? "", canonical: `/category/${c.slug}` },
			})),
		};
	},

	categoryGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		const rows = await db.select().from(categories).where(eq(categories.id, idOrSlug));
		const cat = rows.length
			? rows[0]
			: (await db.select().from(categories).where(eq(categories.slug, idOrSlug)))[0];

		if (!cat) return null;

		return {
			...cat,
			description: cat.description ?? "",
			seo: { title: cat.name, description: cat.description ?? "", canonical: `/category/${cat.slug}` },
		};
	},

	collectionBrowse: async (options?: { active?: boolean; limit?: number }) => {
		let query = db.select().from(collections);
		if (options?.limit) {
			query = query.limit(options.limit) as typeof query;
		}
		const list = await query;
		return {
			data: list.map((c) => ({
				...c,
				description: c.description ?? "",
				active: c.active ?? true,
			})),
		};
	},

	collectionGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		const rows = await db.select().from(collections).where(eq(collections.id, idOrSlug));
		const col = rows[0];
		if (!col) return null;
		return { ...col, description: col.description ?? "", productCollections: [] };
	},

	legalPageBrowse: async () => {
		return {
			data: [
				{
					id: "terms",
					label: "Syarat & Ketentuan",
					href: "/legal/terms",
					updatedAt: new Date().toISOString(),
				},
				{
					id: "privacy",
					label: "Kebijakan Privasi",
					href: "/legal/privacy",
					updatedAt: new Date().toISOString(),
				},
			],
		};
	},

	legalPageGet: async (slug: string) => {
		const label = slug === "terms" ? "Syarat & Ketentuan" : "Kebijakan Privasi";
		return {
			id: `leg-${slug}`,
			label,
			href: `/${slug}`,
			content: `# ${label}\n\nSelamat datang di Ivet Mart Universitas Ivet Semarang.`,
			contentHtml: `<p>Selamat datang di Ivet Mart Universitas Ivet Semarang. Platform belanja resmi Civitas UNISVET.</p>`,
		};
	},

	postBrowse: async (_options?: { active?: boolean; limit?: number }) => {
		return { data: [] as LocalPost[] };
	},

	postGet: async (_params?: { idOrSlug: string }): Promise<LocalPost | null> => {
		return null;
	},

	search: async ({ query, limit = 6 }: { query: string; limit?: number }) => {
		const productsList = await getActiveProducts({ search: query, limit });
		const dbCats = await db.select().from(categories);
		const matchedCats = dbCats
			.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
			.slice(0, limit);

		const items = productsList.map((p) => ({
			id: p.id,
			name: p.name,
			slug: p.slug,
			image: (p.images as string[])?.[0] ?? null,
			summary: p.summary ?? p.description ?? "",
			type: "product" as const,
		}));

		return {
			products: productsList,
			categories: matchedCats,
			collections: [],
			items,
		};
	},

	cartGet: async ({ cartId }: { cartId?: string }): Promise<LocalCart | null> => {
		if (!cartId) return null;

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

		const formattedItems: LocalCartItem[] = items.map(({ cartItem, variant, product }) => {
			const itemVariant: LocalVariant = {
				id: variant.id,
				productId: product.id,
				name: variant.name ?? "",
				price: String(variant.price),
				stock: variant.stock ?? 0,
				images: (variant.images as string[]) ?? [],
				attributes: (variant.attributes as Record<string, string>) ?? {},
			};

			const itemProduct: LocalProduct = {
				id: product.id,
				name: product.name,
				slug: product.slug,
				description: product.description ?? "",
				images: (product.images as string[]) ?? [],
				active: product.active ?? true,
				categoryId: product.categoryId ?? "",
				updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
				variants: [],
			};

			return {
				id: `item-${variant.id}`,
				variantId: variant.id,
				quantity: cartItem.quantity,
				variant: itemVariant,
				productVariant: {
					id: variant.id,
					price: String(variant.price),
					images: (variant.images as string[]) ?? [],
					product: {
						id: product.id,
						name: product.name,
						slug: product.slug,
						images: (product.images as string[]) ?? [],
					},
				},
				product: itemProduct,
			};
		});

		const totalAmount = formattedItems
			.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0)
			.toString();

		return {
			id: cartId,
			items: formattedItems,
			lineItems: formattedItems,
			totalAmount,
		};
	},

	cartUpsert: async ({
		cartId,
		variantId,
		quantity,
		mode,
	}: {
		cartId?: string | null;
		variantId: string;
		quantity: number;
		mode?: "set";
	}) => {
		const id = cartId || `cart-${Date.now()}`;

		// Ensure cart exists
		const existingCart = await db.select().from(carts).where(eq(carts.id, id)).limit(1);
		if (!existingCart.length) {
			await db.insert(carts).values({ id }).onConflictDoNothing();
		}

		const existingItem = await db
			.select()
			.from(cartItems)
			.where(eq(cartItems.cartId, id))
			.then((rows) => rows.find((r) => r.variantId === variantId));

		if (quantity <= 0) {
			if (existingItem) {
				await db.delete(cartItems).where(eq(cartItems.id, existingItem.id));
			}
		} else if (existingItem) {
			const newQty = mode === "set" ? quantity : existingItem.quantity + quantity;
			await db.update(cartItems).set({ quantity: newQty }).where(eq(cartItems.id, existingItem.id));
		} else {
			await db.insert(cartItems).values({
				cartId: id,
				variantId,
				quantity,
			});
		}

		return commerce.cartGet({ cartId: id });
	},

	contactMessageCreate: async (_data?: Record<string, unknown>) => {
		return { success: true };
	},

	newsletterSubscribe: async (_data?: Record<string, unknown>) => {
		return { success: true };
	},

	subscriberCreate: async (_data?: { email: string }) => {
		return { success: true };
	},

	orderGet: async (_params?: { id: string }) => {
		return null as any;
	},
};

export const meGetCached = async () => {
	"use cache";
	return STORE_INFO;
};

export function getStoreFaviconUrl(settings?: typeof STORE_INFO.store.settings | null) {
	return settings?.favicon?.imageUrl ?? "/logo.png";
}

export function getCanonicalUrl(): string {
	if (process.env.NEXT_PUBLIC_URL) {
		return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "");
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return "http://localhost:3000";
}

export const getSubdomainPublicUrl = async () => {
	return { subdomain: "ivetmart", publicUrl: getCanonicalUrl() };
};
