import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
	title: "Sign in",
};

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-64 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-[#80070A] border-t-transparent" />
				</div>
			}
		>
			<LoginForm />
		</Suspense>
	);
}
