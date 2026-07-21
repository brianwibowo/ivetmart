// Self-Hosted Data Access Layer for Ivet Mart
// Replaces Commerce Kit SDK with local database provider (0 external API key dependencies)

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

export type LocalProduct = {
	id: string;
	name: string;
	slug: string;
	description: string;
	summary?: string;
	content?: any;
	categoryId: string;
	category?: { id: string; name: string; slug: string } | any;
	images: string[];
	active: boolean;
	variants: LocalVariant[];
	volumePricingTiers?: any[];
	updatedAt?: string;
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
	productVariant?: LocalVariant;
	product: LocalProduct;
};

export type LocalCart = {
	id: string;
	items: LocalCartItem[];
	totalAmount: string;
};

const CATEGORIES: LocalCategory[] = [
	{
		id: "cat-kuliner",
		name: "Kuliner Khas Semarang",
		slug: "kuliner-semarang",
		description: "Makanan dan oleh-oleh otentik khas Kota Semarang",
		active: true,
	},
	{
		id: "cat-fashion",
		name: "Fashion & Batik",
		slug: "fashion-batik",
		description: "Kain batik Semarangan dan produk kerajinan fashion etnik",
		active: true,
	},
	{
		id: "cat-merch",
		name: "Merchandise UNISVET",
		slug: "merchandise-unisvet",
		description: "Produk dan aksesoris resmi edisi Universitas Ivet Semarang",
		active: true,
	},
];

const COLLECTIONS: LocalCollection[] = [
	{
		id: "col-relax",
		name: "Relax",
		slug: "relax",
		description: "Everything you need to slow down and relax.",
	},
	{
		id: "col-lifestyle",
		name: "Lifestyle",
		slug: "lifestyle",
		description: "Crafted lifestyle products for daily living.",
	},
];

const PRODUCTS: LocalProduct[] = [
	{
		id: "p-lumpia",
		name: "Lumpia Semarang Rebung Original",
		slug: "lumpia-semarang",
		description:
			"Lumpia Semarang khas dengan isian rebung segar, daging ayam, dan telur gurih. Disajikan hangat lengkap dengan saus tauco khas dan kucai segar.",
		summary: "Lumpia Semarang rebung khas dengan saus tauco gurih.",
		categoryId: "cat-kuliner",
		images: ["/products/lumpia-semarang.png"],
		active: true,
		variants: [
			{
				id: "v-lumpia-1",
				productId: "p-lumpia",
				name: "Kemasan Isi 5 Pcs",
				price: "45000",
				stock: 50,
				images: ["/products/lumpia-semarang.png"],
				attributes: { porsi: "Isi 5 Pcs" },
			},
		],
	},
	{
		id: "p-batik",
		name: "Kemeja Batik Semarangan Motif Sekar Jagad",
		slug: "batik-semarangan",
		description:
			"Kemeja batik pria berkualitas tinggi dengan motif Sekar Jagad berornamen khas warna Merah Maroon & Emas UNISVET.",
		summary: "Kemeja batik khas Semarang motif Sekar Jagad warna Maroon & Emas.",
		categoryId: "cat-fashion",
		images: ["/products/batik-semarang.png"],
		active: true,
		variants: [
			{
				id: "v-batik-m",
				productId: "p-batik",
				name: "Ukuran M",
				price: "185000",
				stock: 20,
				images: ["/products/batik-semarang.png"],
				attributes: { ukuran: "M" },
			},
			{
				id: "v-batik-l",
				productId: "p-batik",
				name: "Ukuran L",
				price: "185000",
				stock: 25,
				images: ["/products/batik-semarang.png"],
				attributes: { ukuran: "L" },
			},
		],
	},
	{
		id: "p-bandeng",
		name: "Bandeng Presto Juwana Premium",
		slug: "bandeng-presto",
		description:
			"Bandeng presto duri lunak olahan khas Juwana Semarang. Daging lembut gurih dilengkapi sambal terasi spesial.",
		summary: "Bandeng presto duri lunak khas Juwana Semarang.",
		categoryId: "cat-kuliner",
		images: ["/products/bandeng-presto.png"],
		active: true,
		variants: [
			{
				id: "v-bandeng-1",
				productId: "p-bandeng",
				name: "Kotak 2 Ekor",
				price: "65000",
				stock: 40,
				images: ["/products/bandeng-presto.png"],
				attributes: { kemasan: "Box 2 Ekor" },
			},
		],
	},
	{
		id: "p-tumbler",
		name: "Tumbler & Mug Eksklusif UNISVET",
		slug: "tumbler-unisvet",
		description:
			"Set tumbler stainless steel dan mug keramik edisi spesial Universitas Ivet Semarang berwarna Maroon & Emas.",
		summary: "Set tumbler & mug keramik official UNISVET.",
		categoryId: "cat-merch",
		images: ["/products/tumbler-unisvet.png"],
		active: true,
		variants: [
			{
				id: "v-tumbler-1",
				productId: "p-tumbler",
				name: "Set Maroon Emas",
				price: "120000",
				stock: 100,
				images: ["/products/tumbler-unisvet.png"],
				attributes: { warna: "Maroon & Emas" },
			},
		],
	},
	{
		id: "p-polo",
		name: "Kaos Polo Civitas UNISVET",
		slug: "polo-unisvet",
		description:
			"Kaos polo bahan cotton lacoste premium dengan bordir logo Universitas Ivet Semarang. Nyaman untuk aktivitas harian.",
		summary: "Kaos polo katun lacoste official Universitas Ivet Semarang.",
		categoryId: "cat-merch",
		images: ["/products/polo-unisvet.png"],
		active: true,
		variants: [
			{
				id: "v-polo-m",
				productId: "p-polo",
				name: "Ukuran M",
				price: "110000",
				stock: 45,
				images: ["/products/polo-unisvet.png"],
				attributes: { ukuran: "M" },
			},
			{
				id: "v-polo-l",
				productId: "p-polo",
				name: "Ukuran L",
				price: "110000",
				stock: 50,
				images: ["/products/polo-unisvet.png"],
				attributes: { ukuran: "L" },
			},
		],
	},
	{
		id: "p-wingko",
		name: "Wingko Babat Semarang Cap Kereta Api",
		slug: "wingko-babat",
		description:
			"Kue tradisional khas Semarang dengan perpaduan gurihnya kelapa sangrai muda dan ketan manis harum bakar.",
		summary: "Wingko babat kelapa muda legit khas Semarang.",
		categoryId: "cat-kuliner",
		images: ["/products/wingko-babat.png"],
		active: true,
		variants: [
			{
				id: "v-wingko-1",
				productId: "p-wingko",
				name: "Box Isi 10 Pcs",
				price: "38000",
				stock: 60,
				images: ["/products/wingko-babat.png"],
				attributes: { isi: "10 Pcs" },
			},
		],
	},
	{
		id: "p-tahu",
		name: "Tahu Bakso Semarang Spesial Daging Sapi",
		slug: "tahu-bakso",
		description:
			"Tahu goreng berkualitas berisikan olahan daging sapi cincang padat dan gurih khas Semarang.",
		summary: "Tahu bakso daging sapi cincang gurih khas Semarang.",
		categoryId: "cat-kuliner",
		images: ["/products/tahu-bakso.png"],
		active: true,
		variants: [
			{
				id: "v-tahu-1",
				productId: "p-tahu",
				name: "Box Isi 10 Pcs",
				price: "42000",
				stock: 35,
				images: ["/products/tahu-bakso.png"],
				attributes: { isi: "10 Pcs" },
			},
		],
	},
	{
		id: "p-tastenun",
		name: "Tas Laptop Tenun Etnik Semarang",
		slug: "tas-tenun",
		description:
			"Tas laptop buatan perajin lokal Semarang dari kombinasi kain tenun etnik dan kulit sintetis premium.",
		summary: "Tas laptop tenun etnik buatan perajin Semarang.",
		categoryId: "cat-fashion",
		images: ["/products/tas-tenun.png"],
		active: true,
		variants: [
			{
				id: "v-tastenun-1",
				productId: "p-tastenun",
				name: "Standard 14-15 Inch",
				price: "215000",
				stock: 15,
				images: ["/products/tas-tenun.png"],
				attributes: { ukuran: "14-15 Inch" },
			},
		],
	},
];

// In-memory cart store for local session/dev
const LOCAL_CARTS: Record<string, { variantId: string; quantity: number }[]> = {};

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
			enabledTools: { blog: true, newsletterPopup: false, contactForm: true, reviews: true, cookieConsent: false },
			newsletterPopup: null as any,
			announcementBar:
				"Selamat Datang di Ivet Mart — Pusat Produk Khas Semarang & Merchandise Resmi UNISVET",
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
		let list = PRODUCTS.filter((p) => p.active);
		if (options?.category) {
			const catObj = CATEGORIES.find(c => c.id === options.category || c.slug === options.category);
			const targetCatId = catObj ? catObj.id : options.category;
			const categoryFiltered = list.filter((p) => p.categoryId === targetCatId);
			if (categoryFiltered.length > 0) {
				list = categoryFiltered;
			}
		}
		const searchKeyword = options?.query || options?.search;
		if (searchKeyword) {
			const q = searchKeyword.toLowerCase();
			list = list.filter(
				(p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
			);
		}
		if (options?.limit) {
			list = list.slice(0, options.limit);
		}
		const enrichedList = list.map((p) => {
			const cat = CATEGORIES.find((c) => c.id === p.categoryId || c.slug === p.categoryId);
			return {
				...p,
				updatedAt: (p as any).updatedAt ?? new Date().toISOString(),
				category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : undefined,
			};
		});
		return { data: enrichedList, meta: { total: enrichedList.length, count: enrichedList.length, pagesCount: 1 } };
	},
	productGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		const product = PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
		if (!product) return null;
		const cat = CATEGORIES.find((c) => c.id === product.categoryId || c.slug === product.categoryId);
		return {
			...product,
			updatedAt: (product as any).updatedAt ?? new Date().toISOString(),
			category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : undefined,
		};
	},
	productFilters: async (): Promise<{
		categories: { id: string; name: string; slug: string }[];
		tags?: string[];
		price?: { min: string; max: string };
		priceBounds: { min: number; max: number };
		variantTypes: any[];
		collections: any[];
		brands: any[];
	}> => {
		return {
			categories: CATEGORIES.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
			tags: ["Semarang", "UNISVET", "Kuliner", "Batik", "Merchandise"],
			price: { min: "38000", max: "215000" },
			priceBounds: { min: 38000, max: 215000 },
			variantTypes: [],
			collections: COLLECTIONS,
			brands: [],
		};
	},
	productReviewsBrowse: async ({ idOrSlug }: { idOrSlug: string }, _options?: { limit?: number }) => {
		return {
			data: [],
			summary: { averageRating: 5, totalCount: 0, reviewCount: 0 },
			meta: { averageRating: 5, totalCount: 0, count: 0, offset: 0, limit: 20 },
		};
	},
	productReviewCreate: async (_arg1?: any, _arg2?: any) => {
		return { success: true };
	},
	categoriesBrowse: async (options?: { active?: boolean; limit?: number }) => {
		let list = CATEGORIES;
		if (options?.limit) list = list.slice(0, options.limit);
		return { data: list };
	},
	categoryGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		const category = CATEGORIES.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
		return category ?? null;
	},
	collectionBrowse: async (options?: { active?: boolean; limit?: number }) => {
		let list = COLLECTIONS;
		if (options?.limit) list = list.slice(0, options.limit);
		return { data: list };
	},
	collectionGet: async ({ idOrSlug }: { idOrSlug: string }) => {
		const collection = COLLECTIONS.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
		if (!collection) return null;
		const productCollections = PRODUCTS.map((product) => ({ product }));
		return { ...collection, productCollections };
	},
	legalPageBrowse: async () => {
		return {
			data: [
				{ id: "terms", label: "Syarat & Ketentuan", href: "/legal/terms", updatedAt: new Date().toISOString() },
				{ id: "privacy", label: "Kebijakan Privasi", href: "/legal/privacy", updatedAt: new Date().toISOString() },
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
	postGet: async (_params: { idOrSlug: string }): Promise<LocalPost | null> => {
		return null;
	},
	search: async ({ query, limit = 6 }: { query: string; limit?: number }) => {
		const q = query.toLowerCase();
		const products = PRODUCTS.filter(
			(p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
		).slice(0, limit);
		const categories = CATEGORIES.filter(
			(c) => c.name.toLowerCase().includes(q)
		).slice(0, limit);
		const items = products.map((p) => ({
			id: p.id,
			name: p.name,
			slug: p.slug,
			image: p.images[0] ?? null,
			summary: p.summary ?? p.description,
			type: "product" as const,
		}));
		return {
			products,
			categories,
			collections: [],
			items,
		};
	},
	cartGet: async ({ cartId }: { cartId?: string }): Promise<any> => {
		if (!cartId || !LOCAL_CARTS[cartId]) {
			return null;
		}
		const items = LOCAL_CARTS[cartId]
			.map(({ variantId, quantity }) => {
				const product = PRODUCTS.find((p) => p.variants.some((v) => v.id === variantId));
				const variant = product?.variants.find((v) => v.id === variantId);
				if (!product || !variant) return null;
				return {
					id: `item-${variantId}`,
					variantId,
					quantity,
					variant,
					productVariant: variant,
					product,
				};
			})
			.filter((item: any): item is LocalCartItem => item !== null);

		const totalAmount = items
			.reduce((sum: number, item: any) => sum + Number(item.variant.price) * item.quantity, 0)
			.toString();

		return {
			id: cartId,
			items,
			lineItems: items,
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
		if (!LOCAL_CARTS[id]) {
			LOCAL_CARTS[id] = [];
		}
		const existingIndex = LOCAL_CARTS[id].findIndex((i) => i.variantId === variantId);
		if (quantity <= 0) {
			if (existingIndex !== -1) {
				LOCAL_CARTS[id].splice(existingIndex, 1);
			}
		} else if (existingIndex !== -1) {
			if (mode === "set") {
				LOCAL_CARTS[id][existingIndex].quantity = quantity;
			} else {
				LOCAL_CARTS[id][existingIndex].quantity += quantity;
			}
		} else {
			LOCAL_CARTS[id].push({ variantId, quantity });
		}
		return commerce.cartGet({ cartId: id });
	},
	contactMessageCreate: async (_data: Record<string, unknown>) => {
		return { success: true };
	},
	newsletterSubscribe: async (_data: Record<string, unknown>) => {
		return { success: true };
	},
	subscriberCreate: async (_data: { email: string }) => {
		return { success: true };
	},
	orderGet: async (_params: { id: string }) => {
		return null as any;
	},
};

export const meGetCached = async () => {
	"use cache";
	return STORE_INFO;
};

export function getStoreFaviconUrl(settings: typeof STORE_INFO.store.settings) {
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
