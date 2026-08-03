/**
 * Checkout Link Policy & Cart Mutation Verification Test Suite — Ivet Mart
 *
 * Enforces critical project rules:
 * 1. ALL /checkout links MUST be plain <a> tags (Never <Link> / router.push)
 * 2. Cart mutation lock prevents empty checkout during in-flight writes
 */

import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("CHECKOUT POLICY: app/cart/cart-sidebar.tsx uses plain <a> tag for checkout link", () => {
	const sidebarPath = join(process.cwd(), "app/cart/cart-sidebar.tsx");
	const content = readFileSync(sidebarPath, "utf-8");

	// Must contain plain <a> tag for checkout link
	expect(content).toContain("<a");
	expect(content).toContain("href={checkoutUrl}");

	// Must NOT use Next.js <Link> wrapper for checkout
	expect(content).not.toContain("<Link href={checkoutUrl}");
	expect(content).not.toContain('<Link href="/checkout"');
});

test("CHECKOUT POLICY: Cart sidebar has mutation lock preventing premature navigation", () => {
	const sidebarPath = join(process.cwd(), "app/cart/cart-sidebar.tsx");
	const content = readFileSync(sidebarPath, "utf-8");

	expect(content).toContain("isMutating");
	expect(content).toContain("e.preventDefault()");
});
