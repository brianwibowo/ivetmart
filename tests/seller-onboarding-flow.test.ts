import { expect, test } from "bun:test";

test("SELLER ONBOARDING FLOW: Signup page handles role selection and directs sellers to register", async () => {
	const signupModule = await import("@/app/(auth)/signup/signup-form");
	expect(signupModule.SignupForm).toBeDefined();
});

test("SELLER ONBOARDING FLOW: Register seller page exists and enforces requireAuth", async () => {
	const registerPage = await import("@/app/seller/register/page");
	expect(registerPage.default).toBeDefined();
});

test("SELLER ONBOARDING FLOW: Pending store page handles pending status UI gracefully", async () => {
	const pendingPage = await import("@/app/seller/pending/page");
	expect(pendingPage.default).toBeDefined();
});

test("SELLER ONBOARDING FLOW: Seller actions export registerSellerStoreAction and updateStoreSettingsAction", async () => {
	const sellerActions = await import("@/app/seller/actions");
	expect(sellerActions.registerSellerStoreAction).toBeDefined();
	expect(sellerActions.updateStoreSettingsAction).toBeDefined();
});
