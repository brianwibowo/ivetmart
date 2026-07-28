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
		<Card className="rounded-3xl border-border/80 bg-white/95 p-2 shadow-xl backdrop-blur-md">
			<CardHeader className="space-y-1 text-center pb-4">
				<CardTitle className="text-2xl font-bold tracking-tight text-foreground">
					Selamat Datang Kembali
				</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					Masukkan email dan kata sandi Anda untuk mengakses akun.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4 pt-2">
					{error && (
						<div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
							<span>⚠️</span>
							<span>{error}</span>
						</div>
					)}
					<div className="space-y-1.5">
						<Label
							htmlFor="login-email"
							className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
						>
							Email
						</Label>
						<Input
							id="login-email"
							name="email"
							type="email"
							placeholder="nama@email.com"
							required
							className="h-11 rounded-xl border-border/80 bg-secondary/30 px-3.5 focus-visible:bg-white focus-visible:ring-[#80070A]/30"
						/>
					</div>
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<Label
								htmlFor="login-password"
								className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
							>
								Kata Sandi
							</Label>
						</div>
						<Input
							id="login-password"
							name="password"
							type="password"
							placeholder="••••••••"
							required
							autoComplete="current-password"
							className="h-11 rounded-xl border-border/80 bg-secondary/30 px-3.5 focus-visible:bg-white focus-visible:ring-[#80070A]/30"
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4 pt-4">
					<Button
						type="submit"
						className="h-11 w-full rounded-xl bg-[#80070A] text-white font-semibold shadow-md transition-all hover:bg-[#600507] hover:shadow-lg disabled:opacity-50"
						disabled={pending}
					>
						{pending ? (
							<span className="flex items-center gap-2">
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
								Memproses...
							</span>
						) : (
							"Masuk ke Akun"
						)}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Belum memiliki akun?{" "}
						<Link href="/signup" className="font-semibold text-[#80070A] underline-offset-4 hover:underline">
							Daftar Sekarang
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
