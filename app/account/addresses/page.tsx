/**
 * Buyer Shipping Addresses Page — Ivet Mart
 *
 * Address book management for logged-in buyers.
 * Uses ActionForm + SubmitButton for toast feedback.
 */

import { desc, eq } from "drizzle-orm";
import { Check, Home, MapPin, Plus, Trash2 } from "lucide-react";
import { createAddressAction, deleteAddressAction } from "@/app/account/actions";
import { ActionForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";

export default async function BuyerAddressesPage() {
	const session = await requireAuth();
	const userId = session.user.id;

	const userAddresses = await db
		.select()
		.from(addresses)
		.where(eq(addresses.userId, userId))
		.orderBy(desc(addresses.createdAt));

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Saved Addresses List (2 cols) */}
			<div className="lg:col-span-2 space-y-6">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Alamat Pengiriman</h1>
					<p className="text-sm text-muted-foreground">
						Kelola daftar alamat pengiriman untuk proses checkout yang lebih cepat.
					</p>
				</div>

				<Card className="border-border/60">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<MapPin className="h-5 w-5 text-primary" />
							Alamat Tersimpan
						</CardTitle>
						<CardDescription>Total {userAddresses.length} alamat tersimpan di akun Anda.</CardDescription>
					</CardHeader>
					<CardContent>
						{userAddresses.length === 0 ? (
							<div className="text-center py-12 text-muted-foreground text-sm space-y-2">
								<Home className="h-8 w-8 mx-auto opacity-50" />
								<p className="font-semibold text-foreground">Belum Ada Alamat Tersimpan</p>
								<p className="text-xs">
									Tambahkan alamat pengiriman pertama Anda menggunakan form di samping.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{userAddresses.map((addr) => (
									<div
										key={addr.id}
										className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
											addr.isDefault ? "border-primary bg-primary/5" : "border-border/60 bg-card"
										}`}
									>
										<div className="space-y-1 text-sm">
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs font-semibold">
													{addr.label}
												</Badge>
												{addr.isDefault && (
													<Badge variant="default" className="bg-primary text-xs">
														<Check className="h-3 w-3 mr-1" /> Utama
													</Badge>
												)}
											</div>
											<p className="font-semibold text-foreground">
												{addr.recipientName}{" "}
												<span className="text-xs font-normal text-muted-foreground font-mono">
													({addr.phone})
												</span>
											</p>
											<p className="text-xs text-muted-foreground">
												{addr.addressLine}, {addr.city}, {addr.province}{" "}
												{addr.postalCode && `(${addr.postalCode})`}
											</p>
										</div>

										<div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
											<ActionForm action={deleteAddressAction}>
												<input type="hidden" name="addressId" value={addr.id} />
												<SubmitButton
													variant="ghost"
													size="sm"
													loadingText="..."
													className="text-destructive hover:bg-destructive/10 text-xs h-8"
												>
													<Trash2 className="h-3.5 w-3.5" />
												</SubmitButton>
											</ActionForm>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Add Address Form (1 col) */}
			<div className="space-y-6">
				<Card className="border-border/60 sticky top-6">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Plus className="h-5 w-5 text-primary" />
							Tambah Alamat Baru
						</CardTitle>
						<CardDescription>Isi data penerima & alamat lengkap pengiriman.</CardDescription>
					</CardHeader>
					<ActionForm action={createAddressAction}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="addr-label">Label Alamat</Label>
								<Input id="addr-label" name="label" placeholder="Rumah / Kantor / Kos" defaultValue="Rumah" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="addr-recipient">
									Nama Penerima <span className="text-destructive">*</span>
								</Label>
								<Input
									id="addr-recipient"
									name="recipientName"
									placeholder="Nama lengkap penerima"
									defaultValue={session.user.name}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="addr-phone">
									Nomor Telepon / WA <span className="text-destructive">*</span>
								</Label>
								<Input id="addr-phone" name="phone" type="tel" placeholder="081234567890" required />
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label htmlFor="addr-city">Kota / Kab</Label>
									<Input id="addr-city" name="city" placeholder="Semarang" defaultValue="Semarang" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="addr-postal">Kode Pos</Label>
									<Input id="addr-postal" name="postalCode" placeholder="50234" />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="addr-province">Provinsi</Label>
								<Input
									id="addr-province"
									name="province"
									placeholder="Jawa Tengah"
									defaultValue="Jawa Tengah"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="addr-line">
									Alamat Lengkap <span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="addr-line"
									name="addressLine"
									placeholder="Jl. Pawiyatan Luhur No..."
									rows={3}
									required
								/>
							</div>
						</CardContent>
						<CardContent className="pt-0">
							<SubmitButton loadingText="Simpan..." className="w-full">
								Simpan Alamat
							</SubmitButton>
						</CardContent>
					</ActionForm>
				</Card>
			</div>
		</div>
	);
}
