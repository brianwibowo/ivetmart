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
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const fillDemo = (demoEmail: string, demoPass: string) => {
		setEmail(demoEmail);
		setPassword(demoPass);
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setPending(true);

		try {
			const result = await signIn.email({ email, password });

			if (result.error) {
				const msg = result.error.message?.toLowerCase() || "";
				if (msg.includes("invalid") || msg.includes("password") || msg.includes("email")) {
					setError("Email atau kata sandi yang Anda masukkan salah.");
				} else {
					setError(result.error.message ?? "Gagal masuk ke akun.");
				}
				setPending(false);
				return;
			}
		} catch {
			setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
			setPending(false);
			return;
		}

		// Redirect to callback URL or home
		const target = callbackUrl || "/";
		router.push(target);
		router.refresh();
	};

	return (
		<Card className="rounded-3xl border border-border/60 bg-white/95 p-3 shadow-2xl backdrop-blur-md dark:bg-card">
			<CardHeader className="space-y-1.5 text-center pb-4">
				<CardTitle className="text-2xl font-bold tracking-tight text-foreground">
					Selamat Datang Kembali
				</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					Masukkan email dan kata sandi Anda untuk mengakeses akun.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4 pt-1">
					{error && (
						<div className="flex items-center gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
							<span className="text-base">⚠️</span>
							<span>{error}</span>
						</div>
					)}
					<div className="space-y-1.5">
						<Label
							htmlFor="login-email"
							className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
						>
							Email
						</Label>
						<Input
							id="login-email"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="nama@email.com"
							required
							className="h-12 rounded-2xl border-border/80 bg-slate-50/80 px-4 text-foreground transition-colors focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#80070A]/30 dark:bg-muted/50"
						/>
					</div>
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<Label
								htmlFor="login-password"
								className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
							>
								Kata Sandi
							</Label>
						</div>
						<Input
							id="login-password"
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							autoComplete="current-password"
							className="h-12 rounded-2xl border-border/80 bg-slate-50/80 px-4 text-foreground transition-colors focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#80070A]/30 dark:bg-muted/50"
						/>
					</div>

					{/* Quick Demo Login Buttons */}
					<div className="rounded-2xl bg-secondary/40 p-3 space-y-2 border border-border/40">
						<p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">
							💡 Isi Otomatis Akun Demo
						</p>
						<div className="grid grid-cols-3 gap-1.5">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fillDemo("admin@ivetmart.com", "admin123")}
								className="h-8 rounded-xl text-xs font-semibold hover:bg-[#80070A] hover:text-white transition-all"
							>
								👑 Admin
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fillDemo("seller@ivetmart.com", "seller123")}
								className="h-8 rounded-xl text-xs font-semibold hover:bg-[#80070A] hover:text-white transition-all"
							>
								🏪 Seller
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fillDemo("buyer@ivetmart.com", "buyer123")}
								className="h-8 rounded-xl text-xs font-semibold hover:bg-[#80070A] hover:text-white transition-all"
							>
								🛍️ Buyer
							</Button>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4 pt-4">
					<Button
						type="submit"
						className="h-12 w-full rounded-2xl bg-[#80070A] text-white font-bold text-base shadow-lg shadow-[#80070A]/20 transition-all hover:bg-[#600507] hover:shadow-xl disabled:opacity-50 active:scale-[0.98]"
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
						<Link href="/signup" className="font-bold text-[#80070A] underline-offset-4 hover:underline">
							Daftar Sekarang
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
