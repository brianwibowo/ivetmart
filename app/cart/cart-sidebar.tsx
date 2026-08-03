"use client";

import { Info, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartSidebar() {
	const { isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();

	const checkoutUrl = `/checkout`;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="border-b border-border pb-4">
					<SheetTitle className="flex items-center gap-2">
						Keranjang Belanja
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">({itemCount} produk)</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Tinjau produk dalam keranjang belanja Anda dan lanjut ke pembayaran.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<div className="text-center space-y-1">
							<p className="text-lg font-bold font-serif">Keranjang Belanja Kosong</p>
							<p className="text-sm text-muted-foreground">Pilih produk favoritmu di katalog Ivet Mart.</p>
						</div>
						<Button variant="outline" onClick={closeCart} className="mt-2 font-semibold">
							Lanjut Belanja
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border pt-4 mt-auto">
							<div className="w-full space-y-3.5">
								{/* Workflow Indicator Banner for Guests */}
								<div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3 text-xs border border-amber-200/80 text-amber-900 dark:text-amber-200 flex items-start gap-2.5 shadow-xs">
									<Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
									<div className="space-y-0.5">
										<p className="font-bold">💡 Skema Pembelian & Pembayaran:</p>
										<p className="text-[11px] opacity-90 leading-tight">
											Bebas checkout langsung sebagai <strong>Tamu</strong> atau <strong>Masuk Akun</strong>{" "}
											untuk menyimpan riwayat pesanan Anda.
										</p>
									</div>
								</div>

								<div className="flex items-center justify-between text-base">
									<span className="font-medium text-muted-foreground">Subtotal Total</span>
									<span className="font-bold text-foreground text-lg font-mono">
										{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									Ongkir dan metode pengiriman dihitung saat checkout.
								</p>

								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
								    While a cart write is in flight, block the link: a full navigation now would
								    load /checkout before the item is committed server-side and show an empty cart. */}
								<Button
									asChild
									className="w-full h-12 text-base font-bold bg-[#80070A] hover:bg-[#680508] text-white"
								>
									<a
										href={checkoutUrl}
										aria-disabled={isMutating}
										tabIndex={isMutating ? -1 : undefined}
										onClick={(e) => {
											if (isMutating) {
												e.preventDefault();
											}
										}}
										className={cn(isMutating && "pointer-events-none opacity-60")}
									>
										{isMutating ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin mr-2" />
												Memperbarui...
											</>
										) : (
											"Lanjut ke Pembayaran (Checkout)"
										)}
									</a>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1"
								>
									← Lanjut Belanja Produk Lain
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
