/**
 * Admin Categories Management Page — Ivet Mart
 *
 * Product category management page with inline form to create new categories.
 */

import { FolderPlus, FolderTree } from "lucide-react";
import { createCategoryAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/auth-guard";
import { getAllCategoriesWithCounts } from "@/lib/db/queries/admin";

export default async function AdminCategoriesPage() {
	await requireAdmin();

	const categoriesList = await getAllCategoriesWithCounts();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Categories List (2 cols) */}
			<div className="lg:col-span-2 space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Kategori Produk</h1>
					<p className="text-sm text-muted-foreground">Daftar kategori utama tempat produk dikelompokkan.</p>
				</div>

				<Card className="border-border/60">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<FolderTree className="h-5 w-5 text-primary" />
							Daftar Kategori Aktif
						</CardTitle>
						<CardDescription>Total {categoriesList.length} kategori utama platform.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left">
								<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
									<tr>
										<th className="px-4 py-3">Nama Kategori</th>
										<th className="px-4 py-3">Slug</th>
										<th className="px-4 py-3">Jumlah Produk</th>
										<th className="px-4 py-3 text-right">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/40">
									{categoriesList.map((cat) => (
										<tr key={cat.id} className="hover:bg-muted/20">
											<td className="px-4 py-3 font-semibold text-foreground">
												<div>
													<span>{cat.name}</span>
													{cat.description && (
														<p className="text-xs font-normal text-muted-foreground line-clamp-1">
															{cat.description}
														</p>
													)}
												</div>
											</td>
											<td className="px-4 py-3 font-mono text-xs text-muted-foreground">{cat.slug}</td>
											<td className="px-4 py-3 font-medium">
												<Badge variant="outline" className="text-xs">
													{cat.productCount} Produk
												</Badge>
											</td>
											<td className="px-4 py-3 text-right">
												<Badge variant="default" className="bg-emerald-600 text-xs">
													Aktif
												</Badge>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Add Category Form (1 col) */}
			<div className="space-y-6">
				<Card className="border-border/60 sticky top-6">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<FolderPlus className="h-5 w-5 text-primary" />
							Tambah Kategori Baru
						</CardTitle>
						<CardDescription>Buat kategori baru untuk mengelompokkan katalog.</CardDescription>
					</CardHeader>
					<form action={createCategoryAction}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="cat-name">
									Nama Kategori <span className="text-destructive">*</span>
								</Label>
								<Input id="cat-name" name="name" placeholder="Contoh: Souvenir & Aksesoris" required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="cat-desc">Deskripsi Kategori</Label>
								<Textarea
									id="cat-desc"
									name="description"
									placeholder="Penjelasan singkat mengenai isi kategori..."
									rows={3}
								/>
							</div>
						</CardContent>
						<CardContent className="pt-0">
							<SubmitButton loadingText="Menyimpan..." className="w-full">
								Simpan Kategori
							</SubmitButton>
						</CardContent>
					</form>
				</Card>
			</div>
		</div>
	);
}
