/**
 * Database Seed Script — Ivet Mart
 *
 * Seeds the database with initial data:
 * 1. Admin user
 * 2. Demo seller + verified store
 * 3. Demo buyer
 * 4. Categories
 * 5. Collections
 * 6. Products + variants
 * 7. Platform settings
 *
 * Run: `bun run db:seed`
 */

import { eq } from "drizzle-orm";
import { auth } from "../auth-server";
import { db } from "../db";
import {
	categories,
	collections,
	platformSettings,
	productCollections,
	products,
	sellerStores,
	user,
	variants,
} from "./schema";

// ─── Seed Data ──────────────────────────────────────────

async function seed() {
	console.log("🌱 Seeding database...\n");

	// 1. Seed users & accounts
	console.log("🔑 Seeding users & better-auth accounts...");
	const accountsToSeed = [
		{
			email: "admin@ivetmart.com",
			password: "admin123",
			name: "Admin Ivet Mart",
			role: "admin",
		},
		{
			email: "seller@ivetmart.com",
			password: "seller123",
			name: "Toko Semarang Jaya",
			role: "seller",
		},
		{
			email: "buyer@ivetmart.com",
			password: "buyer123",
			name: "Budi Santoso",
			role: "buyer",
		},
	];

	const createdUserIds: Record<string, string> = {};

	for (const acc of accountsToSeed) {
		try {
			let userId = "";
			const res = await auth.api.signUpEmail({
				body: {
					email: acc.email,
					password: acc.password,
					name: acc.name,
				},
				headers: new Headers(),
			});
			if (res?.user?.id) {
				userId = res.user.id;
			}
			if (!userId) {
				const existing = await db.select().from(user).where(eq(user.email, acc.email)).limit(1);
				if (existing[0]) userId = existing[0].id;
			}

			if (userId) {
				await db.update(user).set({ role: acc.role }).where(eq(user.id, userId));
				createdUserIds[acc.email] = userId;
			}

			console.log(`   ✓ Account created/updated: ${acc.email} (${acc.role})`);
		} catch (e: any) {
			// If already exists, fetch user id and ensure role is updated
			const existing = await db.select().from(user).where(eq(user.email, acc.email)).limit(1);
			if (existing[0]) {
				await db.update(user).set({ role: acc.role }).where(eq(user.id, existing[0].id));
				createdUserIds[acc.email] = existing[0].id;
			}
			console.log(`   ✓ Account updated: ${acc.email} (${acc.role})`);
		}
	}

	// 2. Seller Stores (verified)
	console.log("🏪 Seeding seller stores...");
	const sellerUserId = createdUserIds["seller@ivetmart.com"] || "00000000-0000-0000-0000-000000000002";
	const adminUserId = createdUserIds["admin@ivetmart.com"] || "00000000-0000-0000-0000-000000000001";

	await db
		.insert(sellerStores)
		.values([
			{
				id: "00000000-0000-0000-0000-000000000010",
				userId: sellerUserId,
				name: "Toko Semarang Jaya",
				slug: "semarang-jaya",
				description:
					"Toko oleh-oleh dan kerajinan khas Semarang. Menyediakan produk berkualitas untuk civitas UNISVET.",
				address: "Jl. Pawiyatan Luhur IV No. 1, Bendan Duwur",
				city: "Semarang",
				province: "Jawa Tengah",
				postalCode: "50234",
				phone: "081234567891",
				status: "active",
				verifiedAt: new Date(),
			},
			{
				id: "00000000-0000-0000-0000-000000000099",
				userId: adminUserId,
				name: "Ivet Mart Official Store",
				slug: "ivet-mart-official",
				description: "Toko Resmi Universitas Ivet Semarang — Merchandise Eksklusif & Produk Khas",
				address: "Jl. Pawiyatan Luhur IV No. 1, Semarang",
				city: "Semarang",
				province: "Jawa Tengah",
				postalCode: "50234",
				phone: "081234567890",
				status: "active",
				verifiedAt: new Date(),
			},
		])
		.onConflictDoNothing();

	// 3. Categories
	console.log("📂 Seeding categories...");
	await db
		.insert(categories)
		.values([
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
		])
		.onConflictDoNothing();

	// 4. Collections
	console.log("📦 Seeding collections...");
	await db
		.insert(collections)
		.values([
			{
				id: "col-bestsellers",
				name: "Produk Terlaris",
				slug: "bestsellers",
				description: "Pilihan produk paling diminati civitas UNISVET dan pengunjung",
				active: true,
			},
			{
				id: "col-featured",
				name: "Koleksi Spesial UNISVET",
				slug: "featured",
				description: "Merchandise eksklusif dan kerajinan pilihan UNISVET",
				active: true,
			},
		])
		.onConflictDoNothing();

	// 5. Products
	console.log("🛍️ Seeding products...");
	const sellerStoreId = "00000000-0000-0000-0000-000000000010";

	await db
		.insert(products)
		.values([
			{
				id: "p-lumpia",
				sellerStoreId,
				name: "Lumpia Semarang Rebung Original",
				slug: "lumpia-semarang",
				description:
					"Lumpia Semarang khas dengan isian rebung segar, daging ayam, dan telur gurih. Disajikan hangat lengkap dengan saus tauco khas dan kucai segar.",
				summary: "Lumpia Semarang rebung khas dengan saus tauco gurih.",
				categoryId: "cat-kuliner",
				images: ["/products/lumpia-semarang.png"],
				active: true,
			},
			{
				id: "p-batik",
				sellerStoreId,
				name: "Kemeja Batik Semarangan Motif Sekar Jagad",
				slug: "batik-semarangan",
				description:
					"Kemeja batik pria berkualitas tinggi dengan motif Sekar Jagad berornamen khas warna Merah Maroon & Emas UNISVET.",
				summary: "Kemeja batik khas Semarang motif Sekar Jagad warna Maroon & Emas.",
				categoryId: "cat-fashion",
				images: ["/products/batik-semarang.png"],
				active: true,
			},
			{
				id: "p-bandeng",
				sellerStoreId,
				name: "Bandeng Presto Juwana Premium",
				slug: "bandeng-presto",
				description:
					"Bandeng presto duri lunak olahan khas Juwana Semarang. Daging lembut gurih dilengkapi sambal terasi spesial.",
				summary: "Bandeng presto duri lunak khas Juwana Semarang.",
				categoryId: "cat-kuliner",
				images: ["/products/bandeng-presto.png"],
				active: true,
			},
			{
				id: "p-tumbler",
				sellerStoreId,
				name: "Tumbler & Mug Eksklusif UNISVET",
				slug: "tumbler-unisvet",
				description:
					"Set tumbler stainless steel dan mug keramik edisi spesial Universitas Ivet Semarang berwarna Maroon & Emas.",
				summary: "Set tumbler & mug keramik official UNISVET.",
				categoryId: "cat-merch",
				images: ["/products/tumbler-unisvet.png"],
				active: true,
			},
			{
				id: "p-polo",
				sellerStoreId,
				name: "Kaos Polo Civitas UNISVET",
				slug: "polo-unisvet",
				description:
					"Kaos polo bahan cotton lacoste premium dengan bordir logo Universitas Ivet Semarang. Nyaman untuk aktivitas harian.",
				summary: "Kaos polo katun lacoste official Universitas Ivet Semarang.",
				categoryId: "cat-merch",
				images: ["/products/polo-unisvet.png"],
				active: true,
			},
			{
				id: "p-wingko",
				sellerStoreId,
				name: "Wingko Babat Semarang Cap Kereta Api",
				slug: "wingko-babat",
				description:
					"Kue tradisional khas Semarang dengan perpaduan gurihnya kelapa sangrai muda dan ketan manis harum bakar.",
				summary: "Wingko babat kelapa muda legit khas Semarang.",
				categoryId: "cat-kuliner",
				images: ["/products/wingko-babat.png"],
				active: true,
			},
			{
				id: "p-tahu",
				sellerStoreId,
				name: "Tahu Bakso Semarang Spesial Daging Sapi",
				slug: "tahu-bakso",
				description:
					"Tahu goreng berkualitas berisikan olahan daging sapi cincang padat dan gurih khas Semarang.",
				summary: "Tahu bakso daging sapi cincang gurih khas Semarang.",
				categoryId: "cat-kuliner",
				images: ["/products/tahu-bakso.png"],
				active: true,
			},
			{
				id: "p-tastenun",
				sellerStoreId,
				name: "Tas Laptop Tenun Etnik Semarang",
				slug: "tas-tenun",
				description:
					"Tas laptop buatan perajin lokal Semarang dari kombinasi kain tenun etnik dan kulit sintetis premium.",
				summary: "Tas laptop tenun etnik buatan perajin Semarang.",
				categoryId: "cat-fashion",
				images: ["/products/tas-tenun.png"],
				active: true,
			},
		])
		.onConflictDoNothing();

	// 6. Variants
	console.log("🏷️ Seeding variants...");
	await db
		.insert(variants)
		.values([
			{
				id: "v-lumpia-1",
				productId: "p-lumpia",
				name: "Kemasan Isi 5 Pcs",
				price: 45000,
				stock: 50,
				images: ["/products/lumpia-semarang.png"],
				attributes: { porsi: "Isi 5 Pcs" },
			},
			{
				id: "v-batik-m",
				productId: "p-batik",
				name: "Ukuran M",
				price: 185000,
				stock: 20,
				images: ["/products/batik-semarang.png"],
				attributes: { ukuran: "M" },
			},
			{
				id: "v-batik-l",
				productId: "p-batik",
				name: "Ukuran L",
				price: 185000,
				stock: 25,
				images: ["/products/batik-semarang.png"],
				attributes: { ukuran: "L" },
			},
			{
				id: "v-bandeng-1",
				productId: "p-bandeng",
				name: "Kotak 2 Ekor",
				price: 65000,
				stock: 40,
				images: ["/products/bandeng-presto.png"],
				attributes: { kemasan: "Box 2 Ekor" },
			},
			{
				id: "v-tumbler-1",
				productId: "p-tumbler",
				name: "Set Maroon Emas",
				price: 120000,
				stock: 100,
				images: ["/products/tumbler-unisvet.png"],
				attributes: { warna: "Maroon & Emas" },
			},
			{
				id: "v-polo-m",
				productId: "p-polo",
				name: "Ukuran M",
				price: 110000,
				stock: 45,
				images: ["/products/polo-unisvet.png"],
				attributes: { ukuran: "M" },
			},
			{
				id: "v-polo-l",
				productId: "p-polo",
				name: "Ukuran L",
				price: 110000,
				stock: 50,
				images: ["/products/polo-unisvet.png"],
				attributes: { ukuran: "L" },
			},
			{
				id: "v-wingko-1",
				productId: "p-wingko",
				name: "Box Isi 10 Pcs",
				price: 38000,
				stock: 60,
				images: ["/products/wingko-babat.png"],
				attributes: { isi: "10 Pcs" },
			},
			{
				id: "v-tahu-1",
				productId: "p-tahu",
				name: "Box Isi 10 Pcs",
				price: 42000,
				stock: 35,
				images: ["/products/tahu-bakso.png"],
				attributes: { isi: "10 Pcs" },
			},
			{
				id: "v-tastenun-1",
				productId: "p-tastenun",
				name: "Standard 14-15 Inch",
				price: 215000,
				stock: 15,
				images: ["/products/tas-tenun.png"],
				attributes: { ukuran: "14-15 Inch" },
			},
		])
		.onConflictDoNothing();

	// 7. Product-Collections
	console.log("🔗 Seeding product-collections...");
	await db
		.insert(productCollections)
		.values([
			{ productId: "p-lumpia", collectionId: "col-bestsellers" },
			{ productId: "p-batik", collectionId: "col-bestsellers" },
			{ productId: "p-bandeng", collectionId: "col-bestsellers" },
			{ productId: "p-tumbler", collectionId: "col-bestsellers" },
			{ productId: "p-polo", collectionId: "col-bestsellers" },
			{ productId: "p-wingko", collectionId: "col-bestsellers" },
			{ productId: "p-tahu", collectionId: "col-bestsellers" },
			{ productId: "p-tastenun", collectionId: "col-bestsellers" },
			{ productId: "p-tumbler", collectionId: "col-featured" },
			{ productId: "p-polo", collectionId: "col-featured" },
			{ productId: "p-batik", collectionId: "col-featured" },
			{ productId: "p-tastenun", collectionId: "col-featured" },
		])
		.onConflictDoNothing();

	// 8. Platform Settings
	console.log("⚙️ Seeding platform settings...");
	await db
		.insert(platformSettings)
		.values([
			{
				key: "store_name",
				value: "Ivet Mart",
			},
			{
				key: "store_description",
				value:
					"Marketplace resmi civitas Universitas Ivet Semarang — Menghadirkan produk khas Semarang dan merchandise eksklusif UNISVET.",
			},
			{
				key: "announcement_bar",
				value: "Selamat Datang di Ivet Mart — Pusat Produk Khas Semarang & Merchandise Resmi UNISVET",
			},
			{
				key: "currency",
				value: "IDR",
			},
			{
				key: "locale",
				value: "id-ID",
			},
			{
				key: "enabled_features",
				value: {
					blog: true,
					newsletter: false,
					contactForm: true,
					reviews: true,
					cookieConsent: false,
				},
			},
		])
		.onConflictDoNothing();

	console.log("\n✅ Seeding complete!");
	console.log("   Admin:  admin@ivetmart.com / admin123");
	console.log("   Seller: seller@ivetmart.com / seller123");
	console.log("   Buyer:  buyer@ivetmart.com / buyer123");

	process.exit(0);
}

seed().catch((error) => {
	console.error("❌ Seed failed:", error);
	process.exit(1);
});
