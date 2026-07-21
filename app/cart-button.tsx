"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative inline-flex items-center gap-2 h-10 px-4 rounded-full bg-[#80070A] text-[#FAF4F0] hover:bg-[#680508] transition-all text-sm font-medium shadow-sm"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-4 h-4" />
			<span className="hidden sm:inline">Cart</span>
			<span
				aria-live="polite"
				className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F8C300] text-[#80070A] text-[11px] font-bold"
			>
				{itemCount}
			</span>
		</button>
	);
}
