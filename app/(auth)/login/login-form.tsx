/**
 * Premium Login Form — Ivet Mart
 *
 * Email/password login with role-based direct redirect.
 */

"use client";

import { AlertCircle, Eye, EyeOff, Lock, Mail, Sparkles, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "@/lib/auth-client";

function getTargetForRole(role?: string, callbackUrl?: string | null) {
	if (callbackUrl && callbackUrl !== "/") return callbackUrl;
	if (role === "admin") return "/admin";
	if (role === "seller") return "/seller";
	return "/";
}

export function LoginForm() {
	const router = useRouter();
	const { data: session } = useSession();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	// Auto-redirect if session exists
	useEffect(() => {
		if (session?.user) {
			const userRole = (session.user as { role?: string })?.role;
			const target = getTargetForRole(userRole, callbackUrl);
			router.replace(target);
		}
	}, [session, callbackUrl]);

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
				const userMsg =
					msg.includes("invalid") || msg.includes("password") || msg.includes("email")
						? "Email atau kata sandi yang Anda masukkan salah."
						: (result.error.message ?? "Gagal masuk ke akun.");
				setError(userMsg);
				toast.error(userMsg);
				setPending(false);
				return;
			}

			toast.success("Berhasil masuk ke akun!");
			const userRole = (result.data?.user as { role?: string })?.role;
			const target = getTargetForRole(userRole, callbackUrl);
			window.location.href = target;
		} catch {
			const errText = "Terjadi kesalahan koneksi. Silakan coba lagi.";
			setError(errText);
			toast.error(errText);
			setPending(false);
		}
	};

	return (
		<div className="w-full space-y-6">
			{/* Header Title Section */}
			<div className="space-y-2 text-left">
				<div className="inline-flex items-center gap-2 rounded-full bg-[#F7E6E6] px-3 py-1 text-xs font-bold text-[#80070A]">
					<UserCheck className="h-3.5 w-3.5" />
					<span>AUTENTIKASI AKUN</span>
				</div>
				<h2 className="yns-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Selamat Datang Kembali
				</h2>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Masukkan kredensial akun Anda untuk mengakses fitur lengkap Ivet Mart.
				</p>
			</div>

			{/* Form Container */}
			<form onSubmit={handleSubmit} className="space-y-5">
				{error && (
					<div className="flex items-center gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-semibold animate-in fade-in slide-in-from-top-1">
						<AlertCircle className="h-5 w-5 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{/* Email Field */}
				<div className="space-y-2">
					<Label
						htmlFor="login-email"
						className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
					>
						Alamat Email
					</Label>
					<div className="relative">
						<Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
						<Input
							id="login-email"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="nama@email.com"
							required
							className="h-13 rounded-2xl border border-border/80 bg-white pl-12 pr-4 text-foreground text-sm shadow-sm transition-all focus-visible:border-[#80070A] focus-visible:ring-2 focus-visible:ring-[#80070A]/20"
						/>
					</div>
				</div>

				{/* Password Field */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label
							htmlFor="login-password"
							className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
						>
							Kata Sandi
						</Label>
					</div>
					<div className="relative">
						<Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
						<Input
							id="login-password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							autoComplete="current-password"
							className="h-13 rounded-2xl border border-border/80 bg-white pl-12 pr-12 text-foreground text-sm shadow-sm transition-all focus-visible:border-[#80070A] focus-visible:ring-2 focus-visible:ring-[#80070A]/20"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
							aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
				</div>

				{/* Demo Fill Quick Selector */}
				<div className="rounded-2xl border border-border/60 bg-white/70 p-4 space-y-2.5 shadow-sm backdrop-blur-sm">
					<div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
						<Sparkles className="h-3.5 w-3.5 text-[#F8C300]" />
						<span>ISI OTOMATIS AKUN DEMO</span>
					</div>
					<div className="grid grid-cols-3 gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => fillDemo("admin@ivetmart.com", "admin123")}
							className="h-9 rounded-xl text-xs font-bold border-border/80 bg-white hover:bg-[#80070A] hover:text-white hover:border-[#80070A] transition-all shadow-xs"
						>
							👑 Admin
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => fillDemo("seller@ivetmart.com", "seller123")}
							className="h-9 rounded-xl text-xs font-bold border-border/80 bg-white hover:bg-[#80070A] hover:text-white hover:border-[#80070A] transition-all shadow-xs"
						>
							🏪 Seller
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => fillDemo("buyer@ivetmart.com", "buyer123")}
							className="h-9 rounded-xl text-xs font-bold border-border/80 bg-white hover:bg-[#80070A] hover:text-white hover:border-[#80070A] transition-all shadow-xs"
						>
							🛍️ Buyer
						</Button>
					</div>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					className="h-13 w-full rounded-2xl bg-gradient-to-r from-[#80070A] to-[#A31215] text-white font-bold text-base shadow-xl shadow-[#80070A]/25 transition-all hover:from-[#600507] hover:to-[#80070A] hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50"
					disabled={pending}
				>
					{pending ? (
						<span className="flex items-center gap-2">
							<span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
							Memproses Autentikasi...
						</span>
					) : (
						"Masuk ke Akun"
					)}
				</Button>

				{/* Signup Footer Link */}
				<p className="text-center text-sm text-muted-foreground pt-2">
					Belum memiliki akun?{" "}
					<Link href="/signup" className="font-bold text-[#80070A] underline-offset-4 hover:underline">
						Daftar Sekarang
					</Link>
				</p>
			</form>
		</div>
	);
}
