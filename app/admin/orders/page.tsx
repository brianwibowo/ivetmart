/**
 * Admin Orders Monitoring Page — Ivet Mart
 *
 * Platform-wide transaction & order monitoring across all sellers.
 */

import { desc, eq } from "drizzle-orm";
import { CheckCircle, Clock, ShoppingCart, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { orderSellers, orders, sellerStores, users } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

export default async function AdminOrdersPage() {
	await requireAdmin();

	const allSubOrders = await db
		.select({
			subOrder: orderSellers,
			masterOrder: orders,
			sellerStore: sellerStores,
			buyer: users,
		})
		.from(orderSellers)
		.innerJoin(orders, eq(orderSellers.orderId, orders.id))
		.innerJoin(sellerStores, eq(orderSellers.sellerStoreId, sellerStores.id))
		.leftJoin(users, eq(orders.buyerId, users.id))
		.orderBy(desc(orderSellers.createdAt));

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
					Semua Pesanan Platform
				</h1>
				<p className="text-sm text-muted-foreground">
					Monitoring seluruh transaksi sub-order dari semua penjual di Ivet Mart.
				</p>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<ShoppingCart className="h-5 w-5 text-primary" />
						Daftar Transaksi Sub-Order
					</CardTitle>
					<CardDescription>Total {allSubOrders.length} transaksi tercatat di sistem.</CardDescription>
				</CardHeader>
				<CardContent>
					{allSubOrders.length === 0 ? (
						<div className="text-center py-12 text-muted-foreground text-sm space-y-2">
							<ShoppingCart className="h-8 w-8 mx-auto opacity-50" />
							<p>Belum ada transaksi pesanan tercatat di platform.</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left">
								<thead className="text-xs uppercase text-muted-foreground bg-muted/40 border-b border-border/40">
									<tr>
										<th className="px-4 py-3">ID Sub-Order</th>
										<th className="px-4 py-3">Toko Penjual</th>
										<th className="px-4 py-3">Pembeli</th>
										<th className="px-4 py-3">Subtotal</th>
										<th className="px-4 py-3">No. Resi</th>
										<th className="px-4 py-3">Status</th>
										<th className="px-4 py-3 text-right">Tanggal</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/40">
									{allSubOrders.map(({ subOrder, sellerStore, buyer }) => (
										<tr key={subOrder.id} className="hover:bg-muted/20">
											<td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
												#{subOrder.id.slice(0, 8)}
											</td>
											<td className="px-4 py-3 font-medium text-foreground">{sellerStore.name}</td>
											<td className="px-4 py-3">
												<div className="flex flex-col">
													<span>{buyer?.name || "Pembeli"}</span>
													<span className="text-xs text-muted-foreground font-mono">{buyer?.email}</span>
												</div>
											</td>
											<td className="px-4 py-3 font-medium">
												{formatMoney({
													amount: subOrder.subtotal,
													currency: "IDR",
													locale: "id-ID",
												})}
											</td>
											<td className="px-4 py-3 font-mono text-xs text-muted-foreground">
												{subOrder.trackingNumber || "-"}
											</td>
											<td className="px-4 py-3">
												<StatusBadge status={subOrder.status} />
											</td>
											<td className="px-4 py-3 text-xs text-muted-foreground text-right">
												{subOrder.createdAt ? new Date(subOrder.createdAt).toLocaleDateString("id-ID") : "-"}
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

function StatusBadge({ status }: { status: string }) {
	switch (status) {
		case "completed":
			return (
				<Badge variant="default" className="bg-emerald-600 text-xs">
					<CheckCircle className="h-3 w-3 mr-1" /> Selesai
				</Badge>
			);
		case "shipped":
			return (
				<Badge variant="default" className="bg-blue-600 text-xs">
					<Truck className="h-3 w-3 mr-1" /> Dikirim
				</Badge>
			);
		case "processing":
			return (
				<Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
					<Clock className="h-3 w-3 mr-1" /> Diproses
				</Badge>
			);
		default:
			return (
				<Badge variant="outline" className="text-xs capitalize">
					{status}
				</Badge>
			);
	}
}
