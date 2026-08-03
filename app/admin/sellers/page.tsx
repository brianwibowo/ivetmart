/**
 * Admin Sellers Verification & Management Page — Ivet Mart
 *
 * Tabbed table of seller stores by status (Pending, Active, Rejected, Suspended)
 * with instant approval and rejection actions.
 * Uses ActionForm + SubmitButton for toast feedback.
 */

import { desc, eq } from "drizzle-orm";
import { CheckCircle, Clock, MapPin, Store, XCircle } from "lucide-react";
import { approveSellerAction, rejectSellerAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { sellerStores, user } from "@/lib/db/schema";

export default async function AdminSellersPage() {
	await requireAdmin();

	const allStores = await db
		.select({
			store: sellerStores,
			owner: user,
		})
		.from(sellerStores)
		.innerJoin(user, eq(sellerStores.userId, user.id))
		.orderBy(desc(sellerStores.createdAt));

	const pendingStores = allStores.filter((s) => s.store.status === "pending");
	const activeStores = allStores.filter((s) => s.store.status === "active");
	const rejectedStores = allStores.filter((s) => s.store.status === "rejected");

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
					Verifikasi & Kelola Penjual
				</h1>
				<p className="text-sm text-muted-foreground">
					Tinjau pendaftaran toko baru dan kelola daftar penjual aktif di platform.
				</p>
			</div>

			<Tabs defaultValue={pendingStores.length > 0 ? "pending" : "active"} className="w-full">
				<TabsList className="grid grid-cols-3 max-w-md">
					<TabsTrigger value="pending" className="relative">
						Menunggu ({pendingStores.length})
						{pendingStores.length > 0 && (
							<span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
						)}
					</TabsTrigger>
					<TabsTrigger value="active">Toko Aktif ({activeStores.length})</TabsTrigger>
					<TabsTrigger value="rejected">Ditolak ({rejectedStores.length})</TabsTrigger>
				</TabsList>

				{/* Pending Stores Tab */}
				<TabsContent value="pending" className="mt-4">
					<Card className="border-border/60">
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<Clock className="h-5 w-5 text-amber-500" />
								Pengajuan Toko Menunggu Verifikasi
							</CardTitle>
							<CardDescription>
								Setujui pengajuan toko untuk memberikan akses penjual kepada user.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{pendingStores.length === 0 ? (
								<div className="text-center py-12 text-muted-foreground text-sm space-y-2">
									<CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
									<p className="font-semibold text-foreground">Semua Pengajuan Selesai!</p>
									<p className="text-xs">Tidak ada toko baru yang menunggu verifikasi saat ini.</p>
								</div>
							) : (
								<div className="space-y-4">
									{pendingStores.map(({ store, owner }) => (
										<div
											key={store.id}
											className="p-5 rounded-lg border border-amber-200/80 bg-amber-50/20 dark:bg-amber-950/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
										>
											<div className="space-y-2 max-w-xl">
												<div className="flex items-center gap-2">
													<Store className="h-4 w-4 text-primary" />
													<span className="font-bold text-lg text-foreground">{store.name}</span>
													<Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
														Pending
													</Badge>
												</div>
												<p className="text-xs text-muted-foreground">
													Pemilik: <strong className="text-foreground">{owner.name}</strong> ({owner.email}) —
													HP: {store.phone || owner.phone || "-"}
												</p>
												{store.description && (
													<p className="text-xs text-foreground/80 line-clamp-2 italic bg-background/50 p-2 rounded border border-border/40">
														"{store.description}"
													</p>
												)}
												<p className="text-xs text-muted-foreground flex items-center gap-1">
													<MapPin className="h-3.5 w-3.5 text-muted-foreground" />
													{store.address || "Alamat belum diisi"}, {store.city || "Semarang"},{" "}
													{store.province || "Jawa Tengah"}
												</p>
											</div>

											{/* Action Buttons */}
											<div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
												<ActionForm action={approveSellerAction}>
													<input type="hidden" name="storeId" value={store.id} />
													<SubmitButton
														loadingText="Memproses..."
														className="bg-emerald-600 hover:bg-emerald-700 text-white"
													>
														<CheckCircle className="h-4 w-4 mr-1.5" />
														Setujui Toko
													</SubmitButton>
												</ActionForm>
												<ActionForm action={rejectSellerAction}>
													<input type="hidden" name="storeId" value={store.id} />
													<SubmitButton
														loadingText="Memproses..."
														variant="outline"
														className="text-destructive hover:bg-destructive/10"
													>
														<XCircle className="h-4 w-4 mr-1.5" />
														Tolak
													</SubmitButton>
												</ActionForm>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Active Stores Tab */}
				<TabsContent value="active" className="mt-4">
					<Card className="border-border/60">
						<CardHeader>
							<CardTitle className="text-lg">Daftar Toko Penjual Aktif</CardTitle>
							<CardDescription>Toko yang telah mendapatkan verifikasi resmi Admin Ivet Mart.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full text-sm text-left">
									<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
										<tr>
											<th className="px-4 py-3">Nama Toko</th>
											<th className="px-4 py-3">Pemilik</th>
											<th className="px-4 py-3">Lokasi</th>
											<th className="px-4 py-3">Terverifikasi Pada</th>
											<th className="px-4 py-3 text-right">Status</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-border/40">
										{activeStores.map(({ store, owner }) => (
											<tr key={store.id} className="hover:bg-muted/20">
												<td className="px-4 py-3 font-semibold text-foreground">{store.name}</td>
												<td className="px-4 py-3">
													<div className="flex flex-col">
														<span>{owner.name}</span>
														<span className="text-xs text-muted-foreground">{owner.email}</span>
													</div>
												</td>
												<td className="px-4 py-3 text-xs text-muted-foreground">
													{store.city || "Semarang"}
												</td>
												<td className="px-4 py-3 text-xs text-muted-foreground">
													{store.verifiedAt ? new Date(store.verifiedAt).toLocaleDateString("id-ID") : "-"}
												</td>
												<td className="px-4 py-3 text-right">
													<Badge variant="default" className="bg-emerald-600 text-xs">
														Aktif / Verified
													</Badge>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Rejected Stores Tab */}
				<TabsContent value="rejected" className="mt-4">
					<Card className="border-border/60">
						<CardHeader>
							<CardTitle className="text-lg">Pengajuan Ditolak</CardTitle>
						</CardHeader>
						<CardContent>
							{rejectedStores.length === 0 ? (
								<p className="text-sm text-muted-foreground text-center py-6">
									Tidak ada riwayat pengajuan toko yang ditolak.
								</p>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full text-sm text-left">
										<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
											<tr>
												<th className="px-4 py-3">Nama Toko</th>
												<th className="px-4 py-3">Pemilik</th>
												<th className="px-4 py-3 text-right">Status</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-border/40">
											{rejectedStores.map(({ store, owner }) => (
												<tr key={store.id}>
													<td className="px-4 py-3 font-medium">{store.name}</td>
													<td className="px-4 py-3">{owner.name}</td>
													<td className="px-4 py-3 text-right">
														<Badge variant="destructive" className="text-xs">
															Ditolak
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
