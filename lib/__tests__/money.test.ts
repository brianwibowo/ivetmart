import { expect, test } from "bun:test";
import { formatMoney } from "@/lib/money";

test("formatMoney handles USD correctly", () => {
	const result = formatMoney({ amount: "1999", currency: "USD", locale: "en-US" });
	expect(result).toBe("$19.99");
});

test("formatMoney handles IDR correctly", () => {
	const result = formatMoney({ amount: "45000", currency: "IDR", locale: "id-ID" });
	expect(result).toContain("45.000");
});
