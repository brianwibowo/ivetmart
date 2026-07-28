/**
 * Multi-Vendor Checkout Page — Ivet Mart
 *
 * Enforces requireAuth() server-side (0 leak / unauthenticated access).
 * Groups cart items by seller store, displays BCA manual transfer info,
 * and processes order placement.
 */

import { eq } from "drizzle-orm";
import { CheckCircle, CreditCard, MapPin, ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createOrderAction } from "@/app/account/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { addresses, cartItems, products, sellerStores, variants } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

export default async function CheckoutPage() {
	// ─── STRICT AUTHENTICATION GUARD (No leak) ────
	const session = await requireAuth();
	const userId = session.user.id;

	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		redirect("/cart");
	}

	// Fetch cart items
	const items = await db
		.select({
			cartItem: cartItems,
			variant: variants,
			product: products,
			sellerStore: sellerStores,
		})
		.from(cartItems)
		.innerJoin(variants, eq(cartItems.variantId, variants.id))
		.innerJoin(products, eq(variants.productId, products.id))
		.leftJoin(sellerStores, eq(products.sellerStoreId, sellerStores.id))
		.where(eq(cartItems.cartId, cartId));

	if (!items.length) {
		redirect("/cart");
	}

	// Fetch buyer addresses
	const userAddresses = await db.select().from(addresses).where(eq(addresses.userId, userId));

	const defaultAddress = userAddresses.find((a) => a.isDefault) || userAddresses[0];

	// Group items by seller store
	const groupedBySeller = new Map<string, { storeName: string; items: typeof items }>();

	let grandTotal = 0;

	items.forEach((item) => {
		const storeName = item.sellerStore?.name || "Ivet Mart Official";
		const storeKey = item.sellerStore?.id || "official-store";

		if (!groupedBySeller.has(storeKey)) {
			groupedBySeller.set(storeKey, { storeName, items: [] });
		}
		groupedBySeller.get(storeKey)?.items.push(item);
		grandTotal += Number(item.variant.price) * item.cartItem.quantity;
	});

	return (
		<div className="max-w-4xl mx-auto py-6 space-y-8 px-4">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b border-border/60">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
						Konfirmasi Checkout
					</h1>
					<p className="text-xs text-muted-foreground mt-0.5">
						Selesaikan pesanan Anda di marketplace Ivet Mart.
					</p>
				</div>
				<div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-full border border-emerald-200">
					<ShieldCheck className="h-4 w-4" />
					<span className="font-medium">Transaksi Aman & Terverifikasi</span>
				</div>
			</div>

			<form action={createOrderAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<input type="hidden" name="cartId" value={cartId} />

				{/* Left Column (2 cols) — Address & Items */}
				<div className="lg:col-span-2 space-y-6">
					{/* Address Selector Card */}
					<Card className="border-border/60">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base flex items-center gap-2">
									<MapPin className="h-5 w-5 text-primary" />
									Alamat Pengiriman
								</CardTitle>
								<Link href="/account/addresses" className="text-xs text-primary underline hover:opacity-80">
									{userAddresses.length === 0 ? "+ Tambah Alamat" : "Kelola Alamat"}
								</Link>
							</div>
						</CardHeader>
						<CardContent>
							{userAddresses.length === 0 ? (
								<div className="p-4 rounded-lg border border-dashed border-amber-300 bg-amber-50/50 text-xs text-amber-900">
									<p className="font-semibold">Belum Ada Alamat Pengiriman Tersimpan</p>
									<p className="mt-1 text-muted-foreground">
										Silakan tambahkan alamat pengiriman terlebih dahulu di menu Akun.
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{userAddresses.map((addr) => (
										<label
											key={addr.id}
											className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
												addr.id === defaultAddress?.id
													? "border-primary bg-primary/5"
													: "border-border/60 hover:bg-muted/30"
											}`}
										>
											<input
												type="radio"
												name="addressId"
												value={addr.id}
												defaultChecked={addr.id === defaultAddress?.id}
												className="mt-1 text-primary focus:ring-primary"
											/>
											<div className="text-xs space-y-0.5">
												<div className="flex items-center gap-2">
													<strong className="text-foreground">{addr.recipientName}</strong>
													<Badge variant="outline" className="text-[10px]">
														{addr.label}
													</Badge>
												</div>
												<p className="text-muted-foreground">{addr.phone}</p>
												<p className="text-muted-foreground">
													{addr.addressLine}, {addr.city}, {addr.province}{" "}
													{addr.postalCode && `(${addr.postalCode})`}
												</p>
											</div>
										</label>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Items Grouped By Seller Store */}
					<Card className="border-border/60">
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<ShoppingBag className="h-5 w-5 text-primary" />
								Rincian Produk Dalam Pesanan
							</CardTitle>
							<CardDescription className="text-xs">
								Produk dikelompokkan berdasarkan toko penjual.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{Array.from(groupedBySeller.entries()).map(([storeId, group]) => (
								<div key={storeId} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
									<div className="flex items-center gap-2 text-sm font-bold text-foreground pb-2 border-b border-border/40">
										<Store className="h-4 w-4 text-primary" />
										<span>Toko: {group.storeName}</span>
									</div>

									<div className="space-y-3">
										{group.items.map(({ cartItem, variant, product }) => (
											<div key={cartItem.id} className="flex items-center justify-between text-xs py-1">
												<div className="flex items-center gap-3">
													<div className="h-10 w-10 rounded-md bg-muted border border-border/40 shrink-0 overflow-hidden relative">
														{/* Product Image */}
														<Image
															src={(product.images as string[])?.[0] || "/products/lumpia-semarang.png"}
															alt={product.name}
															fill
															className="object-cover"
														/>
													</div>
													<div>
														<span className="font-semibold text-foreground block">{product.name}</span>
														<span className="text-muted-foreground">
															{variant.name} • {cartItem.quantity}x @{" "}
															{formatMoney({
																amount: variant.price,
																currency: "IDR",
																locale: "id-ID",
															})}
														</span>
													</div>
												</div>
												<span className="font-semibold text-foreground">
													{formatMoney({
														amount: Number(variant.price) * cartItem.quantity,
														currency: "IDR",
														locale: "id-ID",
													})}
												</span>
											</div>
										))}
									</div>
								</div>
							))}

							<div className="space-y-2">
								<Label htmlFor="checkout-notes">Catatan Pesanan (Opsional)</Label>
								<Textarea
									id="checkout-notes"
									name="notes"
									placeholder="Catatan tambahan untuk penjual (misal: bungkus rapi, rasa manis)..."
									rows={2}
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column (1 col) — Payment & Summary */}
				<div className="space-y-6">
					{/* Payment Method Card */}
					<Card className="border-border/60 bg-gradient-to-b from-card to-muted/20">
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<CreditCard className="h-5 w-5 text-primary" />
								Metode Pembayaran
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<label className="flex items-start gap-3 p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer">
								<input
									type="radio"
									name="paymentMethod"
									value="transfer_bca"
									defaultChecked
									className="mt-1 text-primary focus:ring-primary"
								/>
								<div className="text-xs space-y-1">
									<strong className="text-foreground flex items-center gap-1.5">
										Transfer Manual BCA
										<Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-900">
											Rekomendasi
										</Badge>
									</strong>
									<p className="text-muted-foreground">
										Transfer langsung ke rekening Bank BCA resmi Ivet Mart.
									</p>
									<div className="mt-2 p-2.5 rounded bg-background border border-border/60 text-xs font-mono">
										<p className="text-muted-foreground text-[10px]">No. Rekening BCA:</p>
										<p className="text-sm font-bold text-primary">0961166321</p>
										<p className="text-[11px] text-foreground font-sans mt-0.5">A.N: Ivet Mart Marketplace</p>
									</div>
								</div>
							</label>
						</CardContent>
					</Card>

					{/* Order Summary */}
					<Card className="border-border/60 sticky top-6">
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Ringkasan Pembayaran</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-xs">
							<div className="flex justify-between text-muted-foreground">
								<span>Subtotal Produk</span>
								<span>
									{formatMoney({
										amount: grandTotal,
										currency: "IDR",
										locale: "id-ID",
									})}
								</span>
							</div>
							<div className="flex justify-between text-muted-foreground">
								<span>Ongkos Kirim</span>
								<span className="text-emerald-600 font-medium">Gratis (Promo UNISVET)</span>
							</div>
							<div className="pt-3 border-t border-border/60 flex justify-between items-center text-sm font-bold text-foreground">
								<span>Total Tagihan</span>
								<span className="text-primary text-base">
									{formatMoney({
										amount: grandTotal,
										currency: "IDR",
										locale: "id-ID",
									})}
								</span>
							</div>
						</CardContent>
						<CardFooter className="pt-2">
							<SubmitButton loadingText="Membuat Pesanan..." className="w-full" size="lg">
								<CheckCircle className="h-4 w-4 mr-1.5" />
								Buat Pesanan Sekarang
							</SubmitButton>
						</CardFooter>
					</Card>
				</div>
			</form>
		</div>
	);
}
