/**
 * Seller Orders List Page — Ivet Mart
 *
 * Incoming order list for the seller with inline form to update
 * shipping status and tracking numbers (resi).
 */

import { CheckCircle, Clock, ShoppingBag, Truck } from "lucide-react";
import { redirect } from "next/navigation";
import { updateOrderShippingAction } from "@/app/seller/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireSeller } from "@/lib/auth-guard";
import { getSellerOrders, getSellerStoreByUserId } from "@/lib/db/queries/seller";
import { formatMoney } from "@/lib/money";

export default async function SellerOrdersPage() {
	const session = await requireSeller();
	const store = await getSellerStoreByUserId(session.user.id);

	if (store?.status !== "active") {
		redirect("/seller/register");
	}

	const subOrders = await getSellerOrders(store.id);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Pesanan Masuk</h1>
				<p className="text-sm text-muted-foreground">
					Kelola pengiriman pesanan dan perbarui nomor resi pelanggan Anda.
				</p>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg">Daftar Transaksi Sub-Order</CardTitle>
					<CardDescription>Total {subOrders.length} transaksi pesanan masuk.</CardDescription>
				</CardHeader>
				<CardContent>
					{subOrders.length === 0 ? (
						<div className="text-center py-12 space-y-3">
							<ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
							<p className="text-sm font-medium text-foreground">Belum ada pesanan masuk.</p>
							<p className="text-xs text-muted-foreground">
								Pesanan dari pembeli akan otomatis muncul di sini.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{subOrders.map(({ subOrder, buyer }) => (
								<div
									key={subOrder.id}
									className="p-4 rounded-lg border border-border/60 bg-card flex flex-col md:flex-row md:items-center justify-between gap-4"
								>
									{/* Order Info */}
									<div className="space-y-1.5">
										<div className="flex items-center gap-2">
											<span className="font-mono text-sm font-bold text-foreground">
												#{subOrder.id.slice(0, 8)}
											</span>
											<StatusBadge status={subOrder.status} />
										</div>
										<p className="text-xs text-muted-foreground">
											Pembeli: <strong className="text-foreground">{buyer?.name || "Pembeli"}</strong> (
											{buyer?.email})
										</p>
										<p className="text-xs text-muted-foreground">
											Subtotal Produk:{" "}
											<strong className="text-foreground">
												{formatMoney({
													amount: subOrder.subtotal,
													currency: "IDR",
													locale: "id-ID",
												})}
											</strong>
										</p>
										{subOrder.trackingNumber && (
											<p className="text-xs text-emerald-600 font-mono">
												No. Resi: {subOrder.trackingNumber}
											</p>
										)}
									</div>

									{/* Shipping Status Action Form */}
									<form
										action={updateOrderShippingAction}
										className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/40"
									>
										<input type="hidden" name="subOrderId" value={subOrder.id} />
										<Input
											name="trackingNumber"
											placeholder="Nomor Resi (JNE/J&T...)"
											defaultValue={subOrder.trackingNumber || ""}
											className="w-44 text-xs h-9"
										/>
										<select
											name="status"
											defaultValue={subOrder.status}
											className="h-9 rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
										>
											<option value="pending_payment">Belum Bayar</option>
											<option value="processing">Diproses</option>
											<option value="shipped">Dikirim</option>
											<option value="completed">Selesai</option>
										</select>
										<SubmitButton loadingText="..." variant="secondary" className="h-9 text-xs">
											Update Status
										</SubmitButton>
									</form>
								</div>
							))}
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
