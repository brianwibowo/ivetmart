/**
 * Auth Button Component — Ivet Mart
 *
 * Header user authentication button & user dropdown menu.
 * Displays "Masuk / Daftar" when logged out.
 * Displays user profile, role badge, and role-specific dashboard links when logged in.
 */

"use client";

import { Loader2, LogOut, ShieldCheck, ShoppingBag, Store, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";

export function AuthButton() {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	if (isPending) {
		return (
			<Button variant="ghost" size="icon-sm" disabled aria-label="Loading session">
				<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
			</Button>
		);
	}

	// ─── LOGGED OUT STATE ─────────────────────────────────
	if (!session) {
		return (
			<div className="flex items-center gap-1.5">
				<Button variant="ghost" size="sm" asChild className="font-medium text-xs sm:text-sm">
					<Link href="/login">Masuk</Link>
				</Button>
				<Button size="sm" asChild className="font-medium text-xs sm:text-sm hidden sm:inline-flex">
					<Link href="/signup">Daftar</Link>
				</Button>
			</div>
		);
	}

	// ─── LOGGED IN STATE ──────────────────────────────────
	const role = (session.user as { role?: string })?.role || "buyer";

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 border-border/80 hover:border-primary/50"
					aria-label="User menu"
				>
					<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">
						{session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
					</div>
					<span className="max-w-[100px] truncate text-xs font-semibold hidden md:inline-block">
						{session.user.name || "Akun"}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="flex flex-col gap-1">
					<span className="font-bold text-foreground text-sm truncate">{session.user.name || "User"}</span>
					<span className="text-xs text-muted-foreground font-normal truncate">{session.user.email}</span>
					<div className="pt-1">
						{role === "admin" && (
							<Badge variant="default" className="bg-primary text-[10px] px-1.5 py-0">
								<ShieldCheck className="h-3 w-3 mr-1" /> Admin
							</Badge>
						)}
						{role === "seller" && (
							<Badge
								variant="secondary"
								className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] px-1.5 py-0"
							>
								<Store className="h-3 w-3 mr-1" /> Penjual
							</Badge>
						)}
						{role === "buyer" && (
							<Badge variant="outline" className="text-[10px] px-1.5 py-0">
								Pembeli
							</Badge>
						)}
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{/* Role-Specific Navigation Items */}
				<DropdownMenuItem asChild>
					<Link href="/account" className="cursor-pointer">
						<User className="mr-2 h-4 w-4 text-primary" />
						<span>Akun Saya</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href="/account/orders" className="cursor-pointer">
						<ShoppingBag className="mr-2 h-4 w-4 text-primary" />
						<span>Riwayat Pesanan</span>
					</Link>
				</DropdownMenuItem>

				{(role === "seller" || role === "admin") && (
					<DropdownMenuItem asChild>
						<Link href="/seller" className="cursor-pointer">
							<Store className="mr-2 h-4 w-4 text-amber-600" />
							<span>Dashboard Penjual</span>
						</Link>
					</DropdownMenuItem>
				)}

				{role === "admin" && (
					<DropdownMenuItem asChild>
						<Link href="/admin" className="cursor-pointer font-semibold text-primary">
							<ShieldCheck className="mr-2 h-4 w-4 text-primary" />
							<span>Panel Admin</span>
						</Link>
					</DropdownMenuItem>
				)}

				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleSignOut}
					className="text-destructive focus:bg-destructive/10 cursor-pointer"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Keluar Akun</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
