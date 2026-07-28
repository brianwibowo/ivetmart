/**
 * Admin Products Moderation & CRUD Page — Ivet Mart
 *
 * Platform-wide product catalog monitoring, CRUD & moderation with pagination.
 * Allows Admin to add new products, delete products, or toggle active/inactive status.
 */

import { count, desc, eq } from "drizzle-orm";
import { ExternalLink, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { adminDeleteProductAction, toggleProductActiveAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { categories, products, sellerStores, variants } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

export default async function AdminProductsPage(props: { searchParams?: Promise<{ page?: string }> }) {
	await requireAdmin();
	const searchParams = await props.searchParams;
	const currentPage = Number.parseInt(searchParams?.page || "1", 10);
	const pageSize = 10;
	const offset = (currentPage - 1) * pageSize;

	const [totalCountRes] = await db.select({ count: count() }).from(products);
	const totalItems = Number(totalCountRes?.count ?? 0);
	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	const pagedProducts = await db
		.select({
			product: products,
			category: categories,
			sellerStore: sellerStores,
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.leftJoin(sellerStores, eq(products.sellerStoreId, sellerStores.id))
		.orderBy(desc(products.createdAt))
		.limit(pageSize)
		.offset(offset);

	const productIds = pagedProducts.map((p) => p.product.id);
	const productVariants = productIds.length ? await db.select().from(variants) : [];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
						Kelola & Moderasi Produk
					</h1>
					<p className="text-sm text-muted-foreground">
						Katalog seluruh produk dari penjual. Admin memiliki akses penuh CRUD dan takedown produk.
					</p>
				</div>
				<Button asChild size="sm">
					<Link href="/admin/products/new">
						<Plus className="h-4 w-4 mr-1.5" />
						Tambah Produk (Admin)
					</Link>
				</Button>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg">Katalog Produk Terdaftar</CardTitle>
					<CardDescription>Total {totalItems} produk berada di platform Ivet Mart.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left">
							<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
								<tr>
									<th className="px-4 py-3">Produk</th>
									<th className="px-4 py-3">Toko Penjual</th>
									<th className="px-4 py-3">Kategori</th>
									<th className="px-4 py-3">Harga Main</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3 text-right">Aksi Moderasi / Hapus</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/40">
								{pagedProducts.map(({ product, category, sellerStore }) => {
									const mainVariant = productVariants.find((v) => v.productId === product.id);
									const imageSrc = (product.images as string[])?.[0] || "/products/lumpia-semarang.png";

									return (
										<tr key={product.id} className="hover:bg-muted/20">
											<td className="px-4 py-3">
												<div className="flex items-center gap-3">
													<div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border/60 bg-muted shrink-0">
														<Image src={imageSrc} alt={product.name} fill className="object-cover" />
													</div>
													<div className="flex flex-col">
														<span className="font-medium text-foreground line-clamp-1">{product.name}</span>
														<span className="text-xs text-muted-foreground font-mono">ID: {product.id}</span>
													</div>
												</div>
											</td>
											<td className="px-4 py-3">
												<span className="font-semibold text-foreground">
													{sellerStore?.name || "Official Store"}
												</span>
											</td>
											<td className="px-4 py-3 text-xs text-muted-foreground">{category?.name || "-"}</td>
											<td className="px-4 py-3 font-medium">
												{mainVariant
													? formatMoney({
															amount: mainVariant.price,
															currency: "IDR",
															locale: "id-ID",
														})
													: "-"}
											</td>
											<td className="px-4 py-3">
												{product.active ? (
													<Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
														Aktif Publik
													</Badge>
												) : (
													<Badge variant="destructive" className="text-xs">
														Nonaktif (Takedown)
													</Badge>
												)}
											</td>
											<td className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-1">
													<Button asChild variant="ghost" size="sm">
														<Link href={`/product/${product.slug}`} target="_blank">
															<ExternalLink className="h-3.5 w-3.5" />
														</Link>
													</Button>

													<form action={toggleProductActiveAction}>
														<input type="hidden" name="productId" value={product.id} />
														<input type="hidden" name="currentActive" value={String(product.active)} />
														{product.active ? (
															<SubmitButton
																size="sm"
																variant="ghost"
																loadingText="..."
																className="text-amber-600 hover:bg-amber-50 text-xs h-8"
															>
																<EyeOff className="h-3.5 w-3.5 mr-1" />
																Takedown
															</SubmitButton>
														) : (
															<SubmitButton
																size="sm"
																variant="ghost"
																loadingText="..."
																className="text-emerald-600 hover:bg-emerald-50 text-xs h-8"
															>
																<Eye className="h-3.5 w-3.5 mr-1" />
																Aktifkan
															</SubmitButton>
														)}
													</form>

													<form action={adminDeleteProductAction}>
														<input type="hidden" name="productId" value={product.id} />
														<SubmitButton
															size="sm"
															variant="ghost"
															loadingText="..."
															className="text-destructive hover:bg-destructive/10 text-xs h-8"
														>
															<Trash2 className="h-3.5 w-3.5" />
														</SubmitButton>
													</form>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Pagination Controls */}
					<DataTablePagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						pageSize={pageSize}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
