/**
 * All Seller Stores Directory Page — Ivet Mart
 *
 * Route: `/store`
 * Displays all active verified seller stores with their respective products,
 * and features a prominent CTA banner to register a new seller store (`/seller/register`).
 */

import { ArrowRight, MapPin, Phone, ShieldCheck, Sparkles, Store } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllActiveStoresWithProducts } from "@/lib/db/queries/seller";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
	title: "Semua Toko & Mitra Penjual",
	description: "Jelajahi toko-toko terverifikasi mitra civitas UNISVET dan UMKM Semarang di Ivet Mart.",
	alternates: { canonical: "/store" },
};

export default async function StoresDirectoryPage() {
	const stores = await getAllActiveStoresWithProducts();

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
			{/* Page Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
						<Store className="h-3.5 w-3.5" /> Mitra Kewirausahaan UNISVET
					</div>
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-serif">
						Semua Toko & Penjual
					</h1>
					<p className="mt-2 text-muted-foreground max-w-xl">
						Temukan toko-toko mitra resmi civitas Universitas Ivet dan UMKM Semarang.
					</p>
				</div>

				<Badge variant="outline" className="text-sm px-4 py-1.5 self-start md:self-auto font-medium">
					{stores.length} Toko Terdaftar
				</Badge>
			</div>

			{/* Banner CTA Buka Toko */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#80070A] via-[#9a090d] to-[#600507] p-6 sm:p-8 text-white shadow-xl">
				<div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
					<div className="space-y-2 max-w-2xl">
						<div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-amber-200">
							<Sparkles className="h-3.5 w-3.5" /> Peluang Kewirausahaan
						</div>
						<h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
							Punya Produk Khas atau Kerajinan?
						</h2>
						<p className="text-sm text-white/80 leading-relaxed">
							Daftarkan toko Anda di Ivet Mart dan dapatkan akses langsung ke ribuan pembeli civitas UNISVET &
							umum.
						</p>
					</div>

					<Button
						asChild
						size="lg"
						className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg border-0"
					>
						<Link href="/seller/register">
							<Store className="h-4 w-4 mr-2" />
							Buka Toko Sekarang
							<ArrowRight className="h-4 w-4 ml-2" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Stores List */}
			{stores.length === 0 ? (
				<div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border/80 space-y-3">
					<Store className="h-12 w-12 mx-auto text-muted-foreground opacity-40" />
					<h3 className="text-lg font-bold text-foreground">Belum Ada Toko Terdaftar</h3>
					<p className="text-sm text-muted-foreground max-w-md mx-auto">
						Jadilah penjual pertama di Ivet Mart! Daftarkan toko Anda sekarang.
					</p>
					<Button asChild className="mt-4">
						<Link href="/seller/register">Buka Toko Pertama</Link>
					</Button>
				</div>
			) : (
				<div className="space-y-12">
					{stores.map((store) => (
						<div
							key={store.id}
							className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow"
						>
							{/* Store Info Header */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
								<div className="flex items-start sm:items-center gap-4">
									<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-inner">
										{store.name.charAt(0).toUpperCase()}
									</div>
									<div>
										<div className="flex items-center gap-2 flex-wrap">
											<h3 className="text-xl font-bold tracking-tight text-foreground font-serif">
												{store.name}
											</h3>
											<Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
												<ShieldCheck className="h-3 w-3 mr-1" /> Toko Terverifikasi
											</Badge>
										</div>
										{store.description && (
											<p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-xl">
												{store.description}
											</p>
										)}
										<div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
											<span className="flex items-center gap-1">
												<MapPin className="h-3.5 w-3.5 text-primary" />
												{store.city || "Semarang"}, {store.province || "Jawa Tengah"}
											</span>
											{store.phone && (
												<span className="flex items-center gap-1">
													<Phone className="h-3.5 w-3.5 text-primary" />
													{store.phone}
												</span>
											)}
										</div>
									</div>
								</div>

								<Button asChild variant="outline" className="shrink-0 self-start sm:self-auto font-semibold">
									<Link href={`/store/${store.slug}`}>
										Kunjungi Toko
										<ArrowRight className="h-4 w-4 ml-1.5" />
									</Link>
								</Button>
							</div>

							{/* Store Products Preview */}
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
										Produk Unggulan Toko ({store.products.length})
									</h4>
									{store.products.length > 4 && (
										<Link
											href={`/store/${store.slug}`}
											className="text-xs font-semibold text-primary hover:underline"
										>
											Lihat semua {store.products.length} produk →
										</Link>
									)}
								</div>

								{store.products.length === 0 ? (
									<div className="p-4 rounded-lg bg-muted/30 text-xs text-muted-foreground">
										Toko ini sedang menyiapkan katalog produk.
									</div>
								) : (
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
										{store.products.slice(0, 4).map((product) => {
											const defaultVariant = product.variants[0];
											const imageSrc = (product.images as string[])?.[0] || "/products/lumpia-semarang.png";

											return (
												<Link
													key={product.id}
													href={`/product/${product.slug}`}
													className="group block rounded-xl border border-border/50 bg-background overflow-hidden hover:border-primary/50 transition-all p-3 space-y-2"
												>
													<div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
														<Image
															src={imageSrc}
															alt={product.name}
															fill
															className="object-cover transition-transform duration-300 group-hover:scale-105"
														/>
													</div>
													<div>
														<h5 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
															{product.name}
														</h5>
														<p className="text-xs font-bold text-primary font-mono mt-0.5">
															{defaultVariant
																? formatMoney({
																		amount: defaultVariant.price,
																		currency: "IDR",
																		locale: "id-ID",
																	})
																: "-"}
														</p>
													</div>
												</Link>
											);
										})}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
