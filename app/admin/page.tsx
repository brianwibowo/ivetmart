/**
 * Admin Overview Dashboard Page — Ivet Mart
 *
 * Summary metric cards, pending seller approval alerts, and recent platform activity.
 */

import {
	AlertTriangle,
	CheckCircle,
	Clock,
	DollarSign,
	ShoppingCart,
	Store,
	Users,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { approveSellerAction, rejectSellerAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboardStats, getPendingSellers } from "@/lib/db/queries/admin";
import { formatMoney } from "@/lib/money";

export default async function AdminDashboardPage() {
	const stats = await getAdminDashboardStats();
	const pendingSellers = await getPendingSellers();

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
					Overview Platform Admin
				</h1>
				<p className="text-sm text-muted-foreground">
					Ringkasan statistik marketplace Ivet Mart Universitas Ivet Semarang.
				</p>
			</div>

			{/* Alert Banner for Pending Sellers */}
			{pendingSellers.length > 0 && (
				<div className="flex items-center justify-between p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
						<div className="text-sm">
							<span className="font-semibold">{pendingSellers.length} Toko Penjual Menunggu Verifikasi!</span>
							<p className="text-xs opacity-90">
								Tinjau pendaftaran toko baru untuk mengaktifkan akun penjual mereka.
							</p>
						</div>
					</div>
					<Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
						<Link href="/admin/sellers">Tinjau Sekarang</Link>
					</Button>
				</div>
			)}

			{/* Metric Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-xs font-medium text-muted-foreground">Total Pengguna</CardTitle>
						<Users className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
						<p className="text-[11px] text-muted-foreground mt-1">Pembeli, penjual & admin</p>
					</CardContent>
				</Card>

				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-xs font-medium text-muted-foreground">Toko Aktif</CardTitle>
						<Store className="h-4 w-4 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">{stats.activeSellers}</div>
						<p className="text-[11px] text-muted-foreground mt-1">Penjual terverifikasi</p>
					</CardContent>
				</Card>

				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-xs font-medium text-muted-foreground">Pending Verifikasi</CardTitle>
						<Clock className="h-4 w-4 text-amber-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">{stats.pendingSellers}</div>
						<p className="text-[11px] text-muted-foreground mt-1">Menunggu keputusan</p>
					</CardContent>
				</Card>

				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-xs font-medium text-muted-foreground">Total Pesanan</CardTitle>
						<ShoppingCart className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">{stats.totalOrders}</div>
						<p className="text-[11px] text-muted-foreground mt-1">Transaksi platform</p>
					</CardContent>
				</Card>

				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-xs font-medium text-muted-foreground">Volume Transaksi</CardTitle>
						<DollarSign className="h-4 w-4 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-lg font-bold text-foreground truncate">
							{formatMoney({
								amount: stats.totalRevenue,
								currency: "IDR",
								locale: "id-ID",
							})}
						</div>
						<p className="text-[11px] text-muted-foreground mt-1">Total nilai pesanan</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Pending Seller Approval Table */}
			<Card className="border-border/60">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-lg">Pengajuan Toko Terbaru</CardTitle>
						<CardDescription>Daftar calon penjual yang membutuhkan verifikasi Admin.</CardDescription>
					</div>
					<Button asChild variant="ghost" size="sm">
						<Link href="/admin/sellers">Lihat Semua</Link>
					</Button>
				</CardHeader>
				<CardContent>
					{pendingSellers.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground text-sm flex items-center justify-center gap-2">
							<CheckCircle className="h-4 w-4 text-emerald-600" />
							<span>Tidak ada pengajuan toko baru saat ini.</span>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left">
								<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
									<tr>
										<th className="px-4 py-3">Nama Toko</th>
										<th className="px-4 py-3">Pemilik</th>
										<th className="px-4 py-3">Lokasi</th>
										<th className="px-4 py-3">Tanggal Pengajuan</th>
										<th className="px-4 py-3 text-right">Aksi Verifikasi</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/40">
									{pendingSellers.slice(0, 5).map(({ store, owner }) => (
										<tr key={store.id} className="hover:bg-muted/20">
											<td className="px-4 py-3 font-semibold text-foreground">{store.name}</td>
											<td className="px-4 py-3">
												<div className="flex flex-col">
													<span>{owner.name}</span>
													<span className="text-xs text-muted-foreground">{owner.email}</span>
												</div>
											</td>
											<td className="px-4 py-3 text-xs text-muted-foreground">
												{store.city || "Semarang"}, {store.province || "Jawa Tengah"}
											</td>
											<td className="px-4 py-3 text-xs text-muted-foreground">
												{store.createdAt ? new Date(store.createdAt).toLocaleDateString("id-ID") : "-"}
											</td>
											<td className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-2">
													<form action={approveSellerAction}>
														<input type="hidden" name="storeId" value={store.id} />
														<Button
															type="submit"
															size="sm"
															className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
														>
															<CheckCircle className="h-3.5 w-3.5 mr-1" />
															Setujui
														</Button>
													</form>
													<form action={rejectSellerAction}>
														<input type="hidden" name="storeId" value={store.id} />
														<Button
															type="submit"
															size="sm"
															variant="outline"
															className="text-destructive hover:bg-destructive/10 text-xs h-8"
														>
															<XCircle className="h-3.5 w-3.5 mr-1" />
															Tolak
														</Button>
													</form>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
