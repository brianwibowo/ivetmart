/**
 * Signup Form — Ivet Mart
 *
 * Registration form with role selection (Pembeli / Penjual).
 * Premium split-screen styled authentication.
 */

"use client";

import { AlertCircle, Eye, EyeOff, Lock, Mail, ShoppingBag, Store, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

type Role = "buyer" | "seller";

export function SignupForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [role, setRole] = useState<Role>("buyer");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setPending(true);

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signUp.email({
				name,
				email,
				password,
				data: {
					role,
				},
			} as Parameters<typeof signUp.email>[0]);

			if (result.error) {
				const errMsg = result.error.message ?? "Gagal membuat akun";
				setError(errMsg);
				toast.error(errMsg);
				setPending(false);
				return;
			}
		} catch {
			const errMsg = "Terjadi kesalahan. Silakan coba lagi.";
			setError(errMsg);
			toast.error(errMsg);
			setPending(false);
			return;
		}

		toast.success("Akun Anda berhasil dibuat!");
		const target = role === "seller" ? "/seller/register" : "/";
		router.push(target);
		router.refresh();
	};

	return (
		<div className="w-full space-y-6">
			{/* Header Title */}
			<div className="space-y-2 text-left">
				<div className="inline-flex items-center gap-2 rounded-full bg-[#F7E6E6] px-3 py-1 text-xs font-bold text-[#80070A]">
					<UserPlus className="h-3.5 w-3.5" />
					<span>PENDAFTARAN AKUN</span>
				</div>
				<h2 className="yns-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Buat Akun Baru
				</h2>
				<p className="text-sm text-muted-foreground leading-relaxed">
					Daftar dalam hitungan detik untuk mulai berbelanja atau membuka toko online Anda.
				</p>
			</div>

			{/* Form Container */}
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && (
					<div className="flex items-center gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-semibold animate-in fade-in slide-in-from-top-1">
						<AlertCircle className="h-5 w-5 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{/* Role Selector Cards */}
				<div className="space-y-2">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Daftar Sebagai
					</Label>
					<div className="grid grid-cols-2 gap-3">
						<RoleCard
							icon={<ShoppingBag className="h-4 w-4" />}
							label="Pembeli"
							description="Belanja produk khas"
							selected={role === "buyer"}
							onClick={() => setRole("buyer")}
						/>
						<RoleCard
							icon={<Store className="h-4 w-4" />}
							label="Penjual"
							description="Buka toko online"
							selected={role === "seller"}
							onClick={() => setRole("seller")}
						/>
					</div>
				</div>

				{/* Full Name Field */}
				<div className="space-y-1.5">
					<Label
						htmlFor="signup-name"
						className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
					>
						Nama Lengkap
					</Label>
					<div className="relative">
						<User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
						<Input
							id="signup-name"
							name="name"
							type="text"
							placeholder="Nama lengkap Anda"
							required
							className="h-12 rounded-2xl border border-border/80 bg-white pl-12 pr-4 text-foreground text-sm shadow-sm transition-all focus-visible:border-[#80070A] focus-visible:ring-2 focus-visible:ring-[#80070A]/20"
						/>
					</div>
				</div>

				{/* Email Field */}
				<div className="space-y-1.5">
					<Label
						htmlFor="signup-email"
						className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
					>
						Email
					</Label>
					<div className="relative">
						<Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
						<Input
							id="signup-email"
							name="email"
							type="email"
							placeholder="nama@email.com"
							required
							className="h-12 rounded-2xl border border-border/80 bg-white pl-12 pr-4 text-foreground text-sm shadow-sm transition-all focus-visible:border-[#80070A] focus-visible:ring-2 focus-visible:ring-[#80070A]/20"
						/>
					</div>
				</div>

				{/* Password Field */}
				<div className="space-y-1.5">
					<Label
						htmlFor="signup-password"
						className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
					>
						Kata Sandi
					</Label>
					<div className="relative">
						<Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/70" />
						<Input
							id="signup-password"
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="Minimal 6 karakter"
							minLength={6}
							required
							autoComplete="new-password"
							className="h-12 rounded-2xl border border-border/80 bg-white pl-12 pr-12 text-foreground text-sm shadow-sm transition-all focus-visible:border-[#80070A] focus-visible:ring-2 focus-visible:ring-[#80070A]/20"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					className="h-13 w-full rounded-2xl bg-gradient-to-r from-[#80070A] to-[#A31215] text-white font-bold text-base shadow-xl shadow-[#80070A]/25 transition-all hover:from-[#600507] hover:to-[#80070A] hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 mt-2"
					disabled={pending}
				>
					{pending ? (
						<span className="flex items-center gap-2">
							<span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
							Memproses Pendaftaran...
						</span>
					) : (
						"Daftar Sekarang"
					)}
				</Button>

				{/* Login Footer Link */}
				<p className="text-center text-sm text-muted-foreground pt-2">
					Sudah memiliki akun?{" "}
					<Link href="/login" className="font-bold text-[#80070A] underline-offset-4 hover:underline">
						Masuk Ke Akun
					</Link>
				</p>
			</form>
		</div>
	);
}

function RoleCard({
	icon,
	label,
	description,
	selected,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	description: string;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
				selected
					? "border-[#80070A] bg-white text-[#80070A] shadow-md ring-1 ring-[#80070A]/20"
					: "border-border/70 bg-white/70 text-muted-foreground hover:border-[#80070A]/40 hover:bg-white"
			}`}
		>
			<div
				className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
					selected ? "bg-[#80070A] text-white" : "bg-slate-100 text-muted-foreground"
				}`}
			>
				{icon}
			</div>
			<div>
				<h4 className="text-xs font-bold leading-tight">{label}</h4>
				<p className="text-[10px] text-muted-foreground">{description}</p>
			</div>
		</button>
	);
}
