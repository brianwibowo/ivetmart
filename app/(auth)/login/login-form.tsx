/**
 * Login Form — Ivet Mart
 *
 * Email/password login with role-based redirect after success.
 */

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setPending(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signIn.email({ email, password });

			if (result.error) {
				setError(result.error.message ?? "Email atau password salah");
				setPending(false);
				return;
			}
		} catch {
			setError("Terjadi kesalahan. Silakan coba lagi.");
			setPending(false);
			return;
		}

		// Redirect to callback URL or home
		const target = callbackUrl || "/";
		router.push(target);
		router.refresh();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Masuk</CardTitle>
				<CardDescription>Masukkan email dan password untuk masuk ke akun Anda.</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="flex flex-col gap-4">
					{error && (
						<div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
					)}
					<div className="flex flex-col gap-2">
						<Label htmlFor="login-email">Email</Label>
						<Input id="login-email" name="email" type="email" placeholder="email@example.com" required />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="login-password">Password</Label>
						<Input
							id="login-password"
							name="password"
							type="password"
							required
							autoComplete="current-password"
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={pending}>
						{pending ? "Masuk..." : "Masuk"}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Belum punya akun?{" "}
						<Link href="/signup" className="text-primary underline-offset-4 hover:underline">
							Daftar
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
