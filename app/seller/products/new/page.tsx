/**
 * Add New Product Page — Ivet Mart
 *
 * Form for sellers to add a new product to their store catalog.
 */

import { ArrowLeft, PackagePlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createProductAction } from "@/app/seller/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { requireSeller } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { getSellerStoreByUserId } from "@/lib/db/queries/seller";
import { categories } from "@/lib/db/schema";

export default async function NewProductPage() {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (store?.status !== "active") {
		redirect("/seller/register");
	}

	const allCategories = await db.select().from(categories);

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex items-center gap-3">
				<Button asChild variant="ghost" size="sm">
					<Link href="/seller/products">
						<ArrowLeft className="h-4 w-4 mr-1" />
						Kembali
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Tambah Produk Baru</h1>
					<p className="text-xs text-muted-foreground">Lengkapi detail informasi produk yang akan dijual.</p>
				</div>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<PackagePlus className="h-5 w-5 text-primary" />
						Informasi Katalog Produk
					</CardTitle>
					<CardDescription>
						Produk yang ditambahkan akan langsung aktif di katalog toko Ivet Mart.
					</CardDescription>
				</CardHeader>
				<form action={createProductAction}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="prod-name">
								Nama Produk <span className="text-destructive">*</span>
							</Label>
							<Input
								id="prod-name"
								name="name"
								placeholder="Contoh: Lumpia Semarang Goreng Isi Ayam"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="prod-category">
								Kategori <span className="text-destructive">*</span>
							</Label>
							<select
								id="prod-category"
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

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="prod-price">
									Harga Produk (Rp) <span className="text-destructive">*</span>
								</Label>
								<Input id="prod-price" name="price" type="number" placeholder="45000" min={0} required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="prod-stock">Stok Awal</Label>
								<Input
									id="prod-stock"
									name="stock"
									type="number"
									placeholder="50"
									defaultValue="50"
									min={0}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="prod-summary">Ringkasan Singkat</Label>
							<Input
								id="prod-summary"
								name="summary"
								placeholder="Deskripsi 1 kalimat untuk tampilan kartu produk..."
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="prod-desc">Deskripsi Lengkap Produk</Label>
							<Textarea
								id="prod-desc"
								name="description"
								placeholder="Jelaskan spesifikasi, keunggulan, varian rasa, atau porsi..."
								rows={4}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex justify-end gap-3 pt-4 border-t border-border/40">
						<Button asChild variant="outline">
							<Link href="/seller/products">Batal</Link>
						</Button>
						<SubmitButton loadingText="Menyimpan & Mengunggah...">Simpan & Publikasikan</SubmitButton>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
