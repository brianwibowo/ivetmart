/**
 * Seller Products List Page — Ivet Mart
 *
 * Displays all products listed by the seller.
 */

import { ExternalLink, Package, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSeller } from "@/lib/auth-guard";
import { getSellerProducts, getSellerStoreByUserId } from "@/lib/db/queries/seller";
import { formatMoney } from "@/lib/money";

export default async function SellerProductsPage() {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (store?.status !== "active") {
		redirect("/seller/register");
	}

	const sellerProducts = await getSellerProducts(store.id);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Produk Saya</h1>
					<p className="text-sm text-muted-foreground">Kelola daftar produk dan stok barang di toko Anda.</p>
				</div>
				<Button asChild size="sm">
					<Link href="/seller/products/new">
						<Plus className="h-4 w-4 mr-1.5" />
						Tambah Produk Baru
					</Link>
				</Button>
			</div>

			{/* Products Table Card */}
			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg">Daftar Katalog Produk</CardTitle>
					<CardDescription>Total {sellerProducts.length} produk terdaftar di toko Anda.</CardDescription>
				</CardHeader>
				<CardContent>
					{sellerProducts.length === 0 ? (
						<div className="text-center py-12 space-y-3">
							<Package className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
							<p className="text-sm font-medium text-foreground">Belum ada produk yang ditambahkan.</p>
							<p className="text-xs text-muted-foreground max-w-sm mx-auto">
								Mulai jualan dengan menambahkan produk pertama Anda ke katalog Ivet Mart.
							</p>
							<Button asChild size="sm" className="mt-2">
								<Link href="/seller/products/new">
									<Plus className="h-4 w-4 mr-1.5" />
									Tambah Produk Pertama
								</Link>
							</Button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left">
								<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
									<tr>
										<th className="px-4 py-3">Produk</th>
										<th className="px-4 py-3">Harga Utama</th>
										<th className="px-4 py-3">Stok</th>
										<th className="px-4 py-3">Status</th>
										<th className="px-4 py-3 text-right">Aksi</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/40">
									{sellerProducts.map((product) => {
										const defaultVariant = product.variants[0];
										const imageSrc = (product.images as string[])?.[0] || "/products/lumpia-semarang.png";

										return (
											<tr key={product.id} className="hover:bg-muted/20">
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border/60 bg-muted shrink-0">
															<Image src={imageSrc} alt={product.name} fill className="object-cover" />
														</div>
														<div className="flex flex-col">
															<span className="font-medium text-foreground line-clamp-1">{product.name}</span>
															<span className="text-xs text-muted-foreground font-mono">
																ID: {product.id}
															</span>
														</div>
													</div>
												</td>
												<td className="px-4 py-3 font-medium">
													{defaultVariant
														? formatMoney({
																amount: defaultVariant.price,
																currency: "IDR",
																locale: "id-ID",
															})
														: "-"}
												</td>
												<td className="px-4 py-3">
													<span
														className={`font-semibold ${
															(defaultVariant?.stock ?? 0) > 0 ? "text-emerald-600" : "text-destructive"
														}`}
													>
														{defaultVariant?.stock ?? 0} unit
													</span>
												</td>
												<td className="px-4 py-3">
													{product.active ? (
														<Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
															Aktif
														</Badge>
													) : (
														<Badge variant="secondary" className="text-xs">
															Nonaktif
														</Badge>
													)}
												</td>
												<td className="px-4 py-3 text-right space-x-1">
													<Button asChild variant="ghost" size="sm">
														<Link href={`/product/${product.slug}`} target="_blank">
															<ExternalLink className="h-3.5 w-3.5" />
														</Link>
													</Button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
