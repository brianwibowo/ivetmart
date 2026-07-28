/**
 * Seller Main Dashboard Page — Ivet Mart
 *
 * Overview for active sellers:
 * - Summary metric cards (Total Products, Orders, Revenue)
 * - Quick action buttons
 * - Recent orders table
 */

import { ArrowUpRight, DollarSign, Package, Plus, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSeller } from "@/lib/auth-guard";
import { getSellerOrders, getSellerStats, getSellerStoreByUserId } from "@/lib/db/queries/seller";
import { formatMoney } from "@/lib/money";

export default async function SellerDashboardPage() {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (!store) {
		redirect("/seller/register");
	}

	if (store.status === "pending") {
		redirect("/seller/pending");
	}

	const stats = await getSellerStats(store.id);
	const recentOrders = await getSellerOrders(store.id);

	return (
		<div className="space-y-8">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Dashboard Penjual</h1>
					<p className="text-sm text-muted-foreground">
						Selamat datang kembali, <strong className="text-foreground">{store.name}</strong>
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button asChild variant="outline" size="sm">
						<Link href={`/store/${store.slug}`} target="_blank">
							<Store className="h-4 w-4 mr-1.5" />
							Lihat Toko Publik
						</Link>
					</Button>
					<Button asChild size="sm">
						<Link href="/seller/products/new">
							<Plus className="h-4 w-4 mr-1.5" />
							Tambah Produk
						</Link>
					</Button>
				</div>
			</div>

			{/* Metric Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Total Produk</CardTitle>
						<Package className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">{stats.totalProducts}</div>
						<p className="text-xs text-muted-foreground mt-1">Produk terdaftar di toko</p>
					</CardContent>
				</Card>

				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Pesanan Masuk</CardTitle>
						<ShoppingCart className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">{stats.totalOrders}</div>
						<p className="text-xs text-muted-foreground mt-1">Total transaksi sub-order</p>
					</CardContent>
				</Card>

				<Card className="border-border/60">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">Pendapatan (Selesai)</CardTitle>
						<DollarSign className="h-4 w-4 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-foreground">
							{formatMoney({
								amount: stats.totalRevenue,
								currency: "IDR",
								locale: "id-ID",
							})}
						</div>
						<p className="text-xs text-muted-foreground mt-1">Pendapatan terakumulasi</p>
					</CardContent>
				</Card>
			</div>

			{/* Recent Orders Table */}
			<Card className="border-border/60">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-lg">Pesanan Terbaru</CardTitle>
						<CardDescription>Daftar transaksi pesanan masuk yang perlu diproses.</CardDescription>
					</div>
					<Button asChild variant="ghost" size="sm">
						<Link href="/seller/orders">
							Lihat Semua
							<ArrowUpRight className="h-4 w-4 ml-1" />
						</Link>
					</Button>
				</CardHeader>
				<CardContent>
					{recentOrders.length === 0 ? (
						<div className="text-center py-10 text-muted-foreground text-sm space-y-2">
							<ShoppingCart className="h-8 w-8 mx-auto opacity-40 text-primary" />
							<p className="font-semibold text-foreground">Belum ada pesanan masuk</p>
							<p className="text-xs text-muted-foreground max-w-xs mx-auto">
								Pesanan yang dibeli oleh pelanggan toko Anda akan otomatis ditampilkan di sini.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left">
								<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
									<tr>
										<th className="px-4 py-3">ID Pesanan</th>
										<th className="px-4 py-3">Pembeli</th>
										<th className="px-4 py-3">Subtotal</th>
										<th className="px-4 py-3">Status</th>
										<th className="px-4 py-3">Tanggal</th>
										<th className="px-4 py-3 text-right">Aksi</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/40">
									{recentOrders.slice(0, 5).map(({ subOrder, buyer }) => (
										<tr key={subOrder.id} className="hover:bg-muted/20">
											<td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
												#{subOrder.id.slice(0, 8)}
											</td>
											<td className="px-4 py-3">{buyer?.name || "Pembeli"}</td>
											<td className="px-4 py-3 font-medium">
												{formatMoney({
													amount: subOrder.subtotal,
													currency: "IDR",
													locale: "id-ID",
												})}
											</td>
											<td className="px-4 py-3">
												<Badge variant="outline" className="text-xs capitalize">
													{subOrder.status}
												</Badge>
											</td>
											<td className="px-4 py-3 text-xs text-muted-foreground">
												{subOrder.createdAt ? new Date(subOrder.createdAt).toLocaleDateString("id-ID") : "-"}
											</td>
											<td className="px-4 py-3 text-right">
												<Button asChild variant="ghost" size="sm">
													<Link href={`/seller/orders`}>Detail</Link>
												</Button>
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
