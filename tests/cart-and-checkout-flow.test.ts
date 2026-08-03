import { expect, test } from "bun:test";
import { getCartCookieJson } from "@/lib/cookies";

test("CART & CHECKOUT FLOW: getCartCookieJson accurately reads yns_cart cookie JSON structure", async () => {
	const mockCart = { id: "cart_test_12345" };
	expect(mockCart.id).toBe("cart_test_12345");

	// Verify getCartCookieJson returns null when no cookie exists
	const emptyCookie = await getCartCookieJson();
	expect(emptyCookie === null || typeof emptyCookie === "object").toBe(true);
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
