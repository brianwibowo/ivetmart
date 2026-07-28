/**
 * Seller Store Registration Page — Ivet Mart
 *
 * Form for sellers to register their store.
 * After submission, store is set to status 'pending' awaiting admin approval.
 */

import { ShieldCheck, Sparkles, Store, Truck } from "lucide-react";
import { redirect } from "next/navigation";
import { registerSellerStoreAction } from "@/app/seller/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAuth } from "@/lib/auth-guard";
import { getSellerStoreByUserId } from "@/lib/db/queries/seller";

export default async function RegisterSellerStorePage() {
	const session = await requireAuth();

	// If user already has a store, redirect appropriately
	const existingStore = await getSellerStoreByUserId(session.user.id);
	if (existingStore) {
		if (existingStore.status === "pending") redirect("/seller/pending");
		redirect("/seller");
	}

	return (
		<div className="max-w-3xl mx-auto py-6">
			<div className="text-center mb-8">
				<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
					<Store className="h-6 w-6" />
				</div>
				<h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">Daftarkan Toko Anda</h1>
				<p className="text-muted-foreground mt-1 max-w-md mx-auto">
					Mulai berjualan produk khas Semarang & kerajinan UNISVET di Ivet Mart.
				</p>
			</div>

			{/* Benefits Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
				<div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border/60">
					<Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
					<div className="text-xs">
						<p className="font-semibold text-foreground">Jangkauan Luas</p>
						<p className="text-muted-foreground">Civitas UNISVET & umum</p>
					</div>
				</div>
				<div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border/60">
					<ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
					<div className="text-xs">
						<p className="font-semibold text-foreground">Verifikasi Resmi</p>
						<p className="text-muted-foreground">Badge penjual terpercaya</p>
					</div>
				</div>
				<div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border/60">
					<Truck className="h-5 w-5 text-blue-500 shrink-0" />
					<div className="text-xs">
						<p className="font-semibold text-foreground">Kelola Pesanan</p>
						<p className="text-muted-foreground">Dashboard penjualan simpel</p>
					</div>
				</div>
			</div>

			<Card className="border-border/80">
				<CardHeader>
					<CardTitle>Formulir Informasi Toko</CardTitle>
					<CardDescription>
						Isi data toko Anda secara lengkap. Data ini akan ditinjau oleh Admin Ivet Mart.
					</CardDescription>
				</CardHeader>
				<form action={registerSellerStoreAction}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="store-name">
								Nama Toko <span className="text-destructive">*</span>
							</Label>
							<Input
								id="store-name"
								name="name"
								placeholder="Contoh: Toko Oleh-oleh Mbok Sri"
								required
								minLength={3}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="store-desc">Deskripsi Toko</Label>
							<Textarea
								id="store-desc"
								name="description"
								placeholder="Jelaskan produk apa saja yang Anda jual..."
								rows={3}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="store-phone">Nomor Telepon / WhatsApp</Label>
								<Input id="store-phone" name="phone" type="tel" placeholder="081234567890" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="store-city">Kota / Kabupaten</Label>
								<Input id="store-city" name="city" placeholder="Kota Semarang" defaultValue="Kota Semarang" />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="store-province">Provinsi</Label>
								<Input
									id="store-province"
									name="province"
									placeholder="Jawa Tengah"
									defaultValue="Jawa Tengah"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="store-postal">Kode Pos</Label>
								<Input id="store-postal" name="postalCode" placeholder="50234" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="store-address">Alamat Lengkap Toko</Label>
							<Textarea id="store-address" name="address" placeholder="Jl. Pawiyatan Luhur No..." rows={2} />
						</div>
					</CardContent>
					<CardFooter className="flex justify-end gap-3 pt-4 border-t border-border/40">
						<Button type="submit" size="lg" className="w-full sm:w-auto">
							Daftarkan Toko Sekarang
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
