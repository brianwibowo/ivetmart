/**
 * Public Seller Store Front Page — Ivet Mart
 *
 * Dedicated public storefront page for individual seller stores (`/store/[slug]`).
 * Displays store banner, logo, verified seller badge, location, and seller's product catalog.
 */

import { ArrowLeft, MapPin, Package, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSellerProducts, getSellerStoreBySlug } from "@/lib/db/queries/seller";
import { formatMoney } from "@/lib/money";

export default async function PublicSellerStorePage(props: { params: Promise<{ slug: string }> }) {
	const { slug } = await props.params;

	const store = await getSellerStoreBySlug(slug);
	if (!store) {
		notFound();
	}

	const storeProducts = await getSellerProducts(store.id);

	return (
		<div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
			{/* Breadcrumb / Back button */}
			<Button asChild variant="ghost" size="sm">
				<Link href="/products">
					<ArrowLeft className="h-4 w-4 mr-1.5" />
					Kembali ke Semua Produk
				</Link>
			</Button>

			{/* Store Profile Header Banner */}
			<div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-6 md:p-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="flex items-start md:items-center gap-4">
						<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-md">
							{store.name.charAt(0).toUpperCase()}
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">{store.name}</h1>
								<Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
									<ShieldCheck className="h-3 w-3 mr-1" /> Toko Terverifikasi
								</Badge>
							</div>
							{store.description && (
								<p className="text-xs text-muted-foreground max-w-xl">{store.description}</p>
							)}
							<div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
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

					<div className="flex items-center gap-2 shrink-0">
						<Badge variant="outline" className="text-xs px-3 py-1 bg-background font-semibold">
							<Package className="h-3.5 w-3.5 mr-1.5 text-primary" />
							{storeProducts.length} Produk Terdaftar
						</Badge>
					</div>
				</div>
			</div>

			{/* Store Products Section */}
			<div className="space-y-4">
				<div>
					<h2 className="text-xl font-bold tracking-tight text-foreground font-serif">Katalog Produk Toko</h2>
					<p className="text-xs text-muted-foreground">Seluruh produk yang dijual oleh {store.name}.</p>
				</div>

				{storeProducts.length === 0 ? (
					<div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-border/60 space-y-2">
						<Package className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
						<p className="font-semibold text-foreground text-sm">Belum Ada Produk Ditampilkan</p>
						<p className="text-xs text-muted-foreground">Toko ini belum menambahkan produk ke katalog.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{storeProducts.map((product) => {
							const defaultVariant = product.variants[0];
							const imageSrc = (product.images as string[])?.[0] || "/products/lumpia-semarang.png";

							return (
								<Card
									key={product.id}
									className="group border-border/60 hover:border-primary/50 transition-all duration-200 overflow-hidden flex flex-col justify-between"
								>
									<div>
										<div className="relative aspect-square overflow-hidden bg-muted">
											<Image
												src={imageSrc}
												alt={product.name}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										</div>
										<CardHeader className="p-4 pb-2">
											<CardTitle className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
												{product.name}
											</CardTitle>
											{product.summary && (
												<CardDescription className="text-xs line-clamp-2">{product.summary}</CardDescription>
											)}
										</CardHeader>
									</div>

									<CardFooter className="p-4 pt-0 flex items-center justify-between">
										<span className="text-sm font-bold text-primary font-mono">
											{defaultVariant
												? formatMoney({
														amount: defaultVariant.price,
														currency: "IDR",
														locale: "id-ID",
													})
												: "-"}
										</span>
										<Button asChild size="sm" variant="secondary" className="text-xs">
											<Link href={`/product/${product.slug}`}>Detail</Link>
										</Button>
									</CardFooter>
								</Card>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
