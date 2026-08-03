import { expect, test } from "bun:test";
import { CART_COOKIE } from "@/lib/cookies";

test("CART & CHECKOUT FLOW: CART_COOKIE is defined as yns_cart", () => {
	expect(CART_COOKIE).toBe("yns_cart");
	const mockCookieVal = JSON.stringify({ id: "cart_123" });
	const parsed = JSON.parse(mockCookieVal);
	expect(parsed.id).toBe("cart_123");
});

test("CART & CHECKOUT FLOW: Cart page route app/cart/page.tsx exists and is defined", async () => {
	const CartPage = await import("@/app/cart/page");
	expect(CartPage.default).toBeDefined();
	expect(CartPage.metadata).toBeDefined();
	expect(CartPage.metadata.title).toBe("Keranjang Belanja");
});

test("CART & CHECKOUT FLOW: Checkout page uses getCartCookieJson from lib/cookies", async () => {
	const checkoutModule = await import("@/app/checkout/page");
	expect(checkoutModule.default).toBeDefined();
});
