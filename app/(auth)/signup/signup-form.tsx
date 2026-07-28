/**
 * Signup Form — Ivet Mart
 *
 * Registration form with role selection (Pembeli / Penjual).
 * After signup, redirects based on selected role.
 */

"use client";

import { ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

type Role = "buyer" | "seller";

export function SignupForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);
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
				setError(result.error.message ?? "Gagal membuat akun");
				setPending(false);
				return;
			}
		} catch {
			setError("Terjadi kesalahan. Silakan coba lagi.");
			setPending(false);
			return;
		}

		// Redirect based on role
		const target = role === "seller" ? "/seller/register" : "/";
		router.push(target);
		router.refresh();
	};

	return (
		<Card className="rounded-3xl border-border/80 bg-white/95 p-2 shadow-xl backdrop-blur-md">
			<CardHeader className="space-y-1 text-center pb-4">
				<CardTitle className="text-2xl font-bold tracking-tight text-foreground">Buat Akun Baru</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					Daftar untuk mulai berbelanja atau berjualan di Ivet Mart.
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

					{/* Role Selection */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Daftar sebagai
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

					<div className="space-y-1.5">
						<Label
							htmlFor="signup-name"
							className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
						>
							Nama Lengkap
						</Label>
						<Input
							id="signup-name"
							name="name"
							type="text"
							placeholder="Nama lengkap Anda"
							required
							className="h-11 rounded-xl border-border/80 bg-secondary/30 px-3.5 focus-visible:bg-white focus-visible:ring-[#80070A]/30"
						/>
					</div>
					<div className="space-y-1.5">
						<Label
							htmlFor="signup-email"
							className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
						>
							Email
						</Label>
						<Input
							id="signup-email"
							name="email"
							type="email"
							placeholder="nama@email.com"
							required
							className="h-11 rounded-xl border-border/80 bg-secondary/30 px-3.5 focus-visible:bg-white focus-visible:ring-[#80070A]/30"
						/>
					</div>
					<div className="space-y-1.5">
						<Label
							htmlFor="signup-password"
							className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
						>
							Kata Sandi
						</Label>
						<Input
							id="signup-password"
							name="password"
							type="password"
							placeholder="Minimal 6 karakter"
							minLength={6}
							required
							autoComplete="new-password"
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
								Membuat Akun...
							</span>
						) : (
							"Daftar Sekarang"
						)}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Sudah memiliki akun?{" "}
						<Link href="/login" className="font-semibold text-[#80070A] underline-offset-4 hover:underline">
							Masuk Ke Akun
						</Link>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}

// ─── Role Selection Card ────────────────────────────────

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
			className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all ${
				selected
					? "border-[#80070A] bg-[#80070A]/5 text-[#80070A] shadow-sm font-semibold"
					: "border-border/80 bg-secondary/30 text-muted-foreground hover:border-[#80070A]/40 hover:bg-secondary/60"
			}`}
		>
			<div
				className={`p-2 rounded-full ${selected ? "bg-[#80070A] text-white" : "bg-muted text-muted-foreground"}`}
			>
				{icon}
			</div>
			<span className="text-xs font-semibold">{label}</span>
			<span className="text-[10px] opacity-75">{description}</span>
		</button>
	);
}
