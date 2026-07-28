/**
 * Order Success & Payment Instructions Page — Ivet Mart
 *
 * Confirms order placement and displays BCA transfer details (0961166321)
 * with instructions to upload proof of transfer or track order.
 */

import { eq } from "drizzle-orm";
import { ArrowRight, CheckCircle2, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { orderSellers, orders, sellerStores } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

export default async function OrderSuccessPage(props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params;

	const [masterOrder] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

	if (!masterOrder) {
		notFound();
	}

	const subOrders = await db
		.select({
			subOrder: orderSellers,
			sellerStore: sellerStores,
		})
		.from(orderSellers)
		.leftJoin(sellerStores, eq(orderSellers.sellerStoreId, sellerStores.id))
		.where(eq(orderSellers.orderId, masterOrder.id));

	return (
		<div className="max-w-2xl mx-auto py-10 px-4 space-y-8 text-center">
			{/* Success Animation Banner */}
			<div className="space-y-3">
				<div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 animate-bounce">
					<CheckCircle2 className="h-10 w-10" />
				</div>
				<h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
					Pesanan Berhasil Dibuat!
				</h1>
				<p className="text-sm text-muted-foreground max-w-md mx-auto">
					Terima kasih telah berbelanja di Ivet Mart. Nomor pesanan Anda adalah{" "}
					<strong className="text-foreground font-mono">#{masterOrder.id.slice(0, 8)}</strong>
				</p>
			</div>

			{/* BCA Payment Transfer Card */}
			<Card className="border-2 border-primary/30 bg-gradient-to-b from-card to-primary/5 text-left">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-base flex items-center gap-2">
							<CreditCard className="h-5 w-5 text-primary" />
							Instruksi Pembayaran Transfer Bank
						</CardTitle>
						<Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300">
							Menunggu Transfer
						</Badge>
					</div>
					<CardDescription className="text-xs">
						Silakan lakukan transfer sesuai nominal tagihan ke rekening BCA resmi Ivet Mart berikut:
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
						<div className="flex justify-between items-center text-xs text-muted-foreground">
							<span>Bank Tujuan:</span>
							<strong className="text-foreground">Bank BCA (Bank Central Asia)</strong>
						</div>
						<div className="flex justify-between items-center text-xs text-muted-foreground">
							<span>Nomor Rekening:</span>
							<span className="text-xl font-bold text-primary font-mono select-all">0961166321</span>
						</div>
						<div className="flex justify-between items-center text-xs text-muted-foreground">
							<span>Atas Nama:</span>
							<strong className="text-foreground">Ivet Mart Marketplace</strong>
						</div>
						<div className="pt-2 border-t border-border/40 flex justify-between items-center text-sm font-bold">
							<span>Jumlah Transfer Pas:</span>
							<span className="text-primary text-base font-mono">
								{formatMoney({
									amount: masterOrder.totalAmount,
									currency: "IDR",
									locale: "id-ID",
								})}
							</span>
						</div>
					</div>

					<div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
						💡 <strong>Tips Pembayaran:</strong> Masukkan nomor pesanan{" "}
						<code className="font-mono bg-background px-1 py-0.5 rounded">#{masterOrder.id.slice(0, 8)}</code>{" "}
						di berita transfer Anda agar verifikasi pesanan diproses lebih cepat oleh penjual.
					</div>
				</CardContent>
			</Card>

			{/* Sub-Orders Breakdown */}
			<Card className="border-border/60 text-left">
				<CardHeader className="pb-3">
					<CardTitle className="text-base flex items-center gap-2">
						<ShoppingBag className="h-5 w-5 text-primary" />
						Sub-Order Diteruskan ke Penjual ({subOrders.length} Toko)
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3 text-xs">
					{subOrders.map(({ subOrder, sellerStore }) => (
						<div
							key={subOrder.id}
							className="p-3 rounded-lg bg-muted/40 border border-border/40 flex justify-between items-center"
						>
							<div>
								<span className="font-semibold text-foreground block">
									Toko: {sellerStore?.name || "Official Store"}
								</span>
								<span className="text-muted-foreground font-mono">Sub-Order #{subOrder.id.slice(0, 8)}</span>
							</div>
							<span className="font-semibold text-foreground">
								{formatMoney({
									amount: subOrder.subtotal,
									currency: "IDR",
									locale: "id-ID",
								})}
							</span>
						</div>
					))}
				</CardContent>
				<CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-3 border-t border-border/40">
					<Button asChild variant="outline" className="w-full sm:w-auto">
						<Link href="/products">Lanjut Belanja</Link>
					</Button>
					<Button asChild className="w-full sm:w-auto">
						<Link href="/account/orders">
							Pantau Pesanan di Akun
							<ArrowRight className="h-4 w-4 ml-1.5" />
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
