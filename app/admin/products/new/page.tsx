/**
 * Admin Add Product Page — Ivet Mart
 *
 * Form for platform admin to add products to any seller store or official store.
 */

import { eq } from "drizzle-orm";
import { ArrowLeft, PackagePlus } from "lucide-react";
import Link from "next/link";
import { adminCreateProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { categories, sellerStores } from "@/lib/db/schema";

export default async function AdminNewProductPage() {
	await requireAdmin();

	const allCategories = await db.select().from(categories);
	const activeStores = await db.select().from(sellerStores).where(eq(sellerStores.status, "active"));

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex items-center gap-3">
				<Button asChild variant="ghost" size="sm">
					<Link href="/admin/products">
						<ArrowLeft className="h-4 w-4 mr-1" />
						Kembali ke Moderasi Produk
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
						Tambah Produk (Admin)
					</h1>
					<p className="text-xs text-muted-foreground">
						Admin dapat menambahkan produk untuk toko resmi atau toko penjual tertentu.
					</p>
				</div>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<PackagePlus className="h-5 w-5 text-primary" />
						Informasi Katalog Produk Baru
					</CardTitle>
					<CardDescription>Produk yang ditambahkan oleh Admin akan langsung terpublikasi.</CardDescription>
				</CardHeader>
				<form action={adminCreateProductAction}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="admin-prod-name">
								Nama Produk <span className="text-destructive">*</span>
							</Label>
							<Input
								id="admin-prod-name"
								name="name"
								placeholder="Contoh: Merchandise Kaos Polo UNISVET"
								required
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="admin-prod-category">
									Kategori <span className="text-destructive">*</span>
								</Label>
								<select
									id="admin-prod-category"
									name="categoryId"
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
									required
								>
									<option value="">-- Pilih Kategori --</option>
									{allCategories.map((c) => (
										<option key={c.id} value={c.id}>
											{c.name}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="admin-prod-store">Toko Penjual (Opsional)</Label>
								<select
									id="admin-prod-store"
									name="sellerStoreId"
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
								>
									<option value="">-- Offical Store (Default) --</option>
									{activeStores.map((s) => (
										<option key={s.id} value={s.id}>
											{s.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="admin-prod-price">
									Harga Utama (Rp) <span className="text-destructive">*</span>
								</Label>
								<Input
									id="admin-prod-price"
									name="price"
									type="number"
									placeholder="110000"
									min={0}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="admin-prod-stock">Stok Awal</Label>
								<Input
									id="admin-prod-stock"
									name="stock"
									type="number"
									placeholder="50"
									defaultValue="50"
									min={0}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="admin-prod-summary">Ringkasan Singkat</Label>
							<Input id="admin-prod-summary" name="summary" placeholder="Deskripsi singkat kartu produk..." />
						</div>

						<div className="space-y-2">
							<Label htmlFor="admin-prod-desc">Deskripsi Lengkap Produk</Label>
							<Textarea
								id="admin-prod-desc"
								name="description"
								placeholder="Jelaskan spesifikasi, keunggulan produk..."
								rows={4}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex justify-end gap-3 pt-4 border-t border-border/40">
						<Button asChild variant="outline">
							<Link href="/admin/products">Batal</Link>
						</Button>
						<SubmitButton loadingText="Menyimpan...">Simpan & Tambah Produk</SubmitButton>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
