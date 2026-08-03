/**
 * Buyer Order History Page — Ivet Mart
 *
 * Displays all past & active orders placed by the logged-in buyer with pagination.
 */

import { count, desc, eq } from "drizzle-orm";
import { CheckCircle, Clock, ExternalLink, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { OrderStatusStepper } from "@/components/order-status-stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { orderItems, orderSellers, orders, sellerStores } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

export default async function BuyerOrdersPage(props: { searchParams?: Promise<{ page?: string }> }) {
	const session = await requireAuth();
	const buyerId = session.user.id;

	const searchParams = await props.searchParams;
	const currentPage = Number.parseInt(searchParams?.page || "1", 10);
	const pageSize = 10;
	const offset = (currentPage - 1) * pageSize;

	const [totalCountRes] = await db.select({ count: count() }).from(orders).where(eq(orders.buyerId, buyerId));

	const totalItems = Number(totalCountRes?.count ?? 0);
	const totalPages = Math.ceil(totalItems / pageSize) || 1;

	const buyerOrders = await db
		.select()
		.from(orders)
		.where(eq(orders.buyerId, buyerId))
		.orderBy(desc(orders.createdAt))
		.limit(pageSize)
		.offset(offset);

	const masterOrderIds = buyerOrders.map((o) => o.id);

	const subOrders = masterOrderIds.length
		? await db
				.select({
					subOrder: orderSellers,
					sellerStore: sellerStores,
				})
				.from(orderSellers)
				.leftJoin(sellerStores, eq(orderSellers.sellerStoreId, sellerStores.id))
				.orderBy(desc(orderSellers.createdAt))
		: [];

	const subOrderIds = subOrders.map((s) => s.subOrder.id);
	const lineItems = subOrderIds.length ? await db.select().from(orderItems) : [];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Riwayat Pesanan Saya</h1>
				<p className="text-sm text-muted-foreground">
					Pantau status transaksi, nomor resi pengiriman, dan riwayat pesanan Anda.
				</p>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<ShoppingBag className="h-5 w-5 text-primary" />
						Daftar Transaksi Pesanan
					</CardTitle>
					<CardDescription>Total {totalItems} transaksi pemesanan.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{totalItems === 0 ? (
						<div className="text-center py-12 space-y-3">
							<ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
							<p className="text-sm font-medium text-foreground">Belum ada riwayat pesanan.</p>
							<p className="text-xs text-muted-foreground">
								Mulai belanja produk khas Semarang di katalog Ivet Mart!
							</p>
							<Button asChild size="sm" className="mt-2">
								<Link href="/products">Mulai Belanja</Link>
							</Button>
						</div>
					) : (
						<>
							<div className="space-y-6">
								{buyerOrders.map((masterOrder) => {
									const orderSubOrders = subOrders.filter((s) => s.subOrder.orderId === masterOrder.id);

									return (
										<div
											key={masterOrder.id}
											className="p-5 rounded-xl border border-border/80 bg-card space-y-4 shadow-xs"
										>
											{/* Master Order Top Bar */}
											<div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/40 text-xs">
												<div className="flex items-center gap-2">
													<span className="font-mono font-bold text-foreground">
														Order #{masterOrder.id.slice(0, 8)}
													</span>
													<span className="text-muted-foreground">•</span>
													<span className="text-muted-foreground">
														{masterOrder.createdAt
															? new Date(masterOrder.createdAt).toLocaleDateString("id-ID")
															: "-"}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">Total Pembayaran:</span>
													<strong className="text-primary text-sm font-semibold">
														{formatMoney({
															amount: masterOrder.totalAmount,
															currency: "IDR",
															locale: "id-ID",
														})}
													</strong>
												</div>
											</div>

											{/* Sub Orders per Seller */}
											<div className="space-y-3">
												{orderSubOrders.map(({ subOrder, sellerStore }) => {
													const items = lineItems.filter((i) => i.orderSellerId === subOrder.id);

													return (
														<div
															key={subOrder.id}
															className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3 text-xs"
														>
															<div className="flex items-center justify-between pb-1">
																<span className="font-bold text-foreground font-serif text-sm">
																	Toko: {sellerStore?.name || "Official Store"}
																</span>
																<StatusBadge status={subOrder.status} />
															</div>

															<OrderStatusStepper status={subOrder.status} />

															<div className="divide-y divide-border/30">
																{items.map((item) => (
																	<div key={item.id} className="py-1.5 flex justify-between items-center">
																		<div>
																			<span className="font-medium text-foreground">{item.productName}</span>
																			<span className="text-muted-foreground ml-2">x{item.quantity}</span>
																		</div>
																		<span className="font-medium text-foreground">
																			{formatMoney({
																				amount: item.price * item.quantity,
																				currency: "IDR",
																				locale: "id-ID",
																			})}
																		</span>
																	</div>
																))}
															</div>

															{subOrder.trackingNumber && (
																<div className="pt-2 border-t border-border/30 flex items-center justify-between text-emerald-700 font-mono">
																	<span>No. Resi Pengiriman:</span>
																	<strong>{subOrder.trackingNumber}</strong>
																</div>
															)}
														</div>
													);
												})}
											</div>

											{/* Action buttons */}
											<div className="flex justify-end gap-2 pt-2">
												<Button asChild variant="outline" size="sm">
													<Link href={`/order/success/${masterOrder.id}`}>
														Instruksi Pembayaran BCA
														<ExternalLink className="h-3.5 w-3.5 ml-1" />
													</Link>
												</Button>
											</div>
										</div>
									);
								})}
							</div>

							<DataTablePagination
								currentPage={currentPage}
								totalPages={totalPages}
								totalItems={totalItems}
								pageSize={pageSize}
							/>
						</>
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
