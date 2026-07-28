/**
 * Seller Store Settings Page — Ivet Mart
 *
 * Form for sellers to update their store profile information.
 */

import { Save, Store } from "lucide-react";
import { redirect } from "next/navigation";
import { updateStoreSettingsAction } from "@/app/seller/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireSeller } from "@/lib/auth-guard";
import { getSellerStoreByUserId } from "@/lib/db/queries/seller";

export default async function SellerSettingsPage() {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (!store) {
		redirect("/seller/register");
	}

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Pengaturan Toko</h1>
				<p className="text-sm text-muted-foreground">
					Perbarui profil toko dan informasi kontak yang tampil kepada pembeli.
				</p>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Store className="h-5 w-5 text-primary" />
						Profil & Alamat Toko
					</CardTitle>
					<CardDescription>
						Perubahan data akan langsung diperbarui di halaman publik toko Anda.
					</CardDescription>
				</CardHeader>
				<form action={updateStoreSettingsAction}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="edit-store-name">
								Nama Toko <span className="text-destructive">*</span>
							</Label>
							<Input id="edit-store-name" name="name" defaultValue={store.name} required minLength={3} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-store-desc">Deskripsi Toko</Label>
							<Textarea
								id="edit-store-desc"
								name="description"
								defaultValue={store.description || ""}
								rows={3}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="edit-store-phone">Nomor Telepon / WA</Label>
								<Input id="edit-store-phone" name="phone" type="tel" defaultValue={store.phone || ""} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-store-city">Kota / Kabupaten</Label>
								<Input id="edit-store-city" name="city" defaultValue={store.city || "Kota Semarang"} />
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="edit-store-province">Provinsi</Label>
								<Input
									id="edit-store-province"
									name="province"
									defaultValue={store.province || "Jawa Tengah"}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-store-slug">Slug Toko (Read-Only)</Label>
								<Input
									id="edit-store-slug"
									value={store.slug}
									disabled
									className="bg-muted opacity-70 font-mono text-xs"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="edit-store-address">Alamat Lengkap Toko</Label>
							<Textarea id="edit-store-address" name="address" defaultValue={store.address || ""} rows={2} />
						</div>
					</CardContent>
					<CardFooter className="flex justify-end pt-4 border-t border-border/40">
						<Button type="submit">
							<Save className="h-4 w-4 mr-1.5" />
							Simpan Perubahan
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
