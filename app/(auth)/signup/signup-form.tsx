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
		<Card>
			<CardHeader>
				<CardTitle>Buat Akun</CardTitle>
				<CardDescription>Daftar untuk mulai berbelanja atau berjualan di Ivet Mart.</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="flex flex-col gap-5">
					{error && (
						<div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
					)}

					{/* Role Selection */}
					<div className="flex flex-col gap-2">
						<Label>Daftar sebagai</Label>
						<div className="grid grid-cols-2 gap-3">
							<RoleCard
								icon={<ShoppingBag className="h-5 w-5" />}
								label="Pembeli"
								description="Belanja produk khas Semarang"
								selected={role === "buyer"}
								onClick={() => setRole("buyer")}
							/>
							<RoleCard
								icon={<Store className="h-5 w-5" />}
								label="Penjual"
								description="Jual produk di marketplace"
								selected={role === "seller"}
								onClick={() => setRole("seller")}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="signup-name">Nama Lengkap</Label>
						<Input id="signup-name" name="name" type="text" placeholder="Nama lengkap kamu" required />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="signup-email">Email</Label>
						<Input id="signup-email" name="email" type="email" placeholder="email@example.com" required />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="signup-password">Password</Label>
						<Input
							id="signup-password"
							name="password"
							type="password"
							minLength={6}
							required
							autoComplete="new-password"
						/>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col gap-4">
					<Button type="submit" className="w-full" disabled={pending}>
						{pending ? "Membuat akun..." : "Buat Akun"}
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Sudah punya akun?{" "}
						<Link href="/login" className="text-primary underline-offset-4 hover:underline">
							Masuk
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
			className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all ${
				selected
					? "border-primary bg-primary/5 text-primary"
					: "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
			}`}
		>
			{icon}
			<span className="text-sm font-medium">{label}</span>
			<span className="text-xs opacity-70">{description}</span>
		</button>
	);
}
