/**
 * Full Shopping Cart Page — Ivet Mart
 *
 * Dedicated page route `/cart` for viewing shopping cart items,
 * adjusting quantities, and proceeding to checkout.
 */

import { ArrowLeft, ArrowRight, Info, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getCart } from "@/app/cart/actions";
import { CartItem } from "@/app/cart/cart-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
	title: "Keranjang Belanja",
	description: "Tinjau produk dalam keranjang belanja Anda di Ivet Mart.",
	alternates: { canonical: "/cart" },
};

export default async function CartPage() {
	const cart = await getCart();
	const lineItems = cart?.lineItems || [];

	const subtotal = lineItems.reduce((acc, item) => {
		const price = BigInt(item.productVariant.price);
		return acc + price * BigInt(item.quantity);
	}, 0n);

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
			{/* Page Title & Back link */}
			<div className="flex items-center justify-between pb-4 border-b border-border/60">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
						Keranjang Belanja
					</h1>
					<p className="text-xs text-muted-foreground mt-1">
						{lineItems.length > 0
							? `Terdapat ${lineItems.length} produk dalam keranjang Anda.`
							: "Keranjang belanja Anda saat ini kosong."}
					</p>
				</div>
				<Button asChild variant="outline" size="sm">
					<Link href="/products">
						<ArrowLeft className="h-4 w-4 mr-1.5" />
						Lanjut Belanja
					</Link>
				</Button>
			</div>

			{/* Info Banner for Guest/Unauthenticated users */}
			<div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-4 text-xs border border-amber-200/80 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
				<Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
				<div className="space-y-1">
					<p className="font-bold text-sm">💡 Panduan Belanja & Pembayaran Ivet Mart:</p>
					<p className="text-xs opacity-90 leading-relaxed">
						Anda dapat langsung melanjutkan ke pembayaran sebagai <strong>Tamu</strong> atau{" "}
						<strong>Masuk Akun</strong> terlebih dahulu untuk menyimpan seluruh riwayat transaksi di profil
						Anda.
					</p>
				</div>
			</div>

			{/* Cart Items List */}
			{lineItems.length === 0 ? (
				<Card className="border-border/60 text-center py-16">
					<CardContent className="space-y-4">
						<ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground opacity-40" />
						<div className="space-y-1">
							<h3 className="text-lg font-bold text-foreground">Keranjang Belanja Kosong</h3>
							<p className="text-xs text-muted-foreground max-w-sm mx-auto">
								Belum ada produk yang dimasukkan. Jelajahi berbagai produk khas Semarang & merchandise
								UNISVET.
							</p>
						</div>
						<Button asChild size="lg" className="mt-2 font-bold bg-[#80070A] hover:bg-[#680508] text-white">
							<Link href="/products">Jelajahi Produk Sekarang</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Items List */}
					<div className="lg:col-span-2 space-y-4">
						<Card className="border-border/60">
							<CardHeader className="pb-3">
								<CardTitle className="text-base font-bold">Daftar Produk ({lineItems.length})</CardTitle>
							</CardHeader>
							<CardContent className="divide-y divide-border/60">
								{lineItems.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</CardContent>
						</Card>
					</div>

					{/* Order Summary & Checkout Action */}
					<div className="space-y-4">
						<Card className="border-border/60 shadow-sm sticky top-24">
							<CardHeader className="pb-3">
								<CardTitle className="text-base font-bold">Ringkasan Pesanan</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Subtotal Produk</span>
									<span className="font-bold text-foreground font-mono">
										{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
									<span>Biaya Pengiriman</span>
									<span>Dihitung saat checkout</span>
								</div>

								<div className="pt-4 border-t border-border/60">
									<Button
										asChild
										size="lg"
										className="w-full font-bold bg-[#80070A] hover:bg-[#680508] text-white h-12"
									>
										<a href="/checkout">
											Lanjut ke Pembayaran
											<ArrowRight className="h-4 w-4 ml-2" />
										</a>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			)}
		</div>
	);
}
