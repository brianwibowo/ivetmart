import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";

export const metadata: Metadata = {
	title: "Tentang Kami",
	description:
		"Mengenal Ivet Mart — Marketplace resmi Universitas Ivet (UNISVET) Semarang tempat pemberdayaan UMKM lokal dan merchant civitas akademika.",
	alternates: { canonical: "/about" },
	openGraph: {
		type: "website",
		title: "Tentang Kami — Ivet Mart Marketplace",
		description:
			"Mengenal Ivet Mart — Marketplace resmi Universitas Ivet (UNISVET) Semarang tempat pemberdayaan UMKM lokal dan merchant civitas akademika.",
		url: "/about",
	},
};

async function getStoreInfo() {
	try {
		const me = await meGetCached();
		return {
			storeName: me.store.name || "Ivet Mart",
			storeDescription:
				me.store.settings?.storeDescription || "Pusat Produk Khas Semarang & Merchandise Resmi UNISVET",
			contactFormEnabled: me.store.settings?.enabledTools?.contactForm ?? false,
		};
	} catch {
		return {
			storeName: "Ivet Mart",
			storeDescription: "Pusat Produk Khas Semarang & Merchandise Resmi UNISVET",
			contactFormEnabled: false,
		};
	}
}

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const { storeName, storeDescription, contactFormEnabled } = await getStoreInfo();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `Tentang ${storeName}`,
		description: storeDescription,
	};

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={aboutJsonLd} />

			{/* Breadcrumb Header */}
			<div className="mb-10">
				<YnsLink
					prefetch="eager"
					href="/"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Beranda
				</YnsLink>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm text-foreground font-medium">Tentang Kami</span>
				<h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight font-serif text-foreground">
					Pemberdayaan UMKM & Merchandise Resmi UNISVET
				</h1>
				<p className="mt-3 text-lg text-muted-foreground leading-relaxed">{storeDescription}</p>
			</div>

			{/* Story & Vision */}
			<div className="space-y-12">
				<section className="rounded-2xl border border-border/80 bg-card p-8 shadow-xs">
					<h2 className="text-2xl font-bold tracking-tight mb-4 font-serif text-[#80070A]">
						Kisah & Misi Ivet Mart
					</h2>
					<div className="space-y-4 text-muted-foreground leading-relaxed text-base">
						<p>
							<strong>Ivet Mart</strong> lahir dari komitmen Universitas Ivet (UNISVET) Semarang untuk
							menciptakan ekosistem perdagangan digital 2-sisi yang transparan, mandiri, dan inklusif. Kami
							menghubungkan mahasiswa, alumni, civitas akademika, dan pelaku UMKM lokal Semarang langsung
							dengan pembeli tanpa perantara berbelit-belit.
						</p>
						<p>
							Mulai dari oleh-oleh khas Semarang seperti Lumpia Goreng renyah dan Bandeng Presto duri lunak,
							hingga merchandise eksklusif kampus UNISVET (jaket, kaos, pouch, batik Semarang), seluruh produk
							dikurasi dengan standar kualitas terbaik.
						</p>
					</div>
				</section>

				{/* Values */}
				<section>
					<h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground font-serif">
						Nilai Utama Kami
					</h2>
					<div className="grid gap-6 sm:grid-cols-3">
						<div className="rounded-xl border border-border bg-card p-6 shadow-xs">
							<div className="text-2xl mb-3">🛍️</div>
							<h3 className="text-base font-bold text-foreground">100% Asli & Berkualitas</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								Produk dipasok langsung dari toko resmi UNISVET dan pengrajin UMKM Semarang terverifikasi.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6 shadow-xs">
							<div className="text-2xl mb-3">🏪</div>
							<h3 className="text-base font-bold text-foreground">Dukungan Merchant Lokal</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								Memberikan wadah gratis bagi wirausaha muda dan UMKM kampus untuk tumbuh bersama.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6 shadow-xs">
							<div className="text-2xl mb-3">🤝</div>
							<h3 className="text-base font-bold text-foreground">Transaksi Mudah & Aman</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								Sistem checkout terpadu, konfirmasi resi cepat, dan bantuan layanan pelanggan yang responsif.
							</p>
						</div>
					</div>
				</section>
			</div>

			{/* CTA */}
			<div className="mt-16 rounded-2xl border border-border/80 bg-gradient-to-br from-[#80070A]/5 via-background to-amber-500/5 p-8 text-center shadow-xs">
				<h2 className="text-2xl font-bold tracking-tight font-serif">Siap Mulai Belanja atau Buka Toko?</h2>
				<p className="mt-2 text-muted-foreground max-w-xl mx-auto">
					Jelajahi produk favoritmu sekarang atau daftarkan tokomu dalam waktu kurang dari 2 menit.
				</p>
				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<YnsLink
						prefetch="eager"
						href="/products"
						className="inline-flex h-11 items-center justify-center rounded-full bg-[#80070A] hover:bg-[#680508] px-8 font-semibold text-white transition-all shadow-xs"
					>
						🛍️ Jelajahi Produk
					</YnsLink>
					<YnsLink
						prefetch="eager"
						href="/seller/register"
						className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-8 font-semibold text-foreground transition-all hover:bg-secondary"
					>
						🏪 Buka Toko Gratis
					</YnsLink>
					{contactFormEnabled && (
						<YnsLink
							prefetch="eager"
							href="/contact"
							className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-8 font-semibold text-foreground transition-all hover:bg-secondary"
						>
							Hubungi Kami
						</YnsLink>
					)}
				</div>
			</div>
		</div>
	);
}
