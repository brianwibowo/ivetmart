/**
 * Buyer Account Sidebar Navigation — Ivet Mart
 *
 * Sidebar menu for buyer account section.
 */

"use client";

import { ChevronRight, Home, LogOut, MapPin, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";

export function BuyerAccountSidebarNav() {
	const pathname = usePathname();

	const navItems = [
		{
			href: "/account",
			label: "Profil Saya",
			icon: <User className="h-4 w-4" />,
			exact: true,
		},
		{
			href: "/account/orders",
			label: "Riwayat Pesanan",
			icon: <ShoppingBag className="h-4 w-4" />,
		},
		{
			href: "/account/addresses",
			label: "Alamat Pengiriman",
			icon: <MapPin className="h-4 w-4" />,
		},
	];

	return (
		<aside className="w-full md:w-64 shrink-0 border-r border-border/60 bg-card p-4 flex flex-col justify-between rounded-xl md:rounded-r-none">
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 border border-primary/20">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<User className="h-5 w-5" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-semibold uppercase tracking-wider text-primary">Akun Saya</span>
						<span className="text-sm font-bold text-foreground">Pembeli Ivet Mart</span>
					</div>
				</div>

				<nav className="flex flex-col gap-1">
					{navItems.map((item) => {
						const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
									isActive
										? "bg-primary text-primary-foreground font-semibold"
										: "text-foreground/80 hover:bg-muted hover:text-foreground"
								}`}
							>
								<div className="flex items-center gap-2.5">
									{item.icon}
									<span>{item.label}</span>
								</div>
								{isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="flex flex-col gap-1.5 pt-4 border-t border-border/40 mt-6 md:mt-0">
				<Link
					href="/"
					className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-2 rounded-md hover:bg-secondary/60 transition-colors"
				>
					<Home className="h-4 w-4 text-primary" />
					<span>Beranda Marketplace</span>
				</Link>
				<button
					type="button"
					onClick={async () => {
						toast.info("Anda telah keluar dari akun");
						await signOut();
						window.location.href = "/";
					}}
					className="flex items-center gap-2 text-xs font-medium text-destructive hover:bg-destructive/10 px-2.5 py-2 rounded-md transition-colors w-full text-left cursor-pointer"
				>
					<LogOut className="h-4 w-4" />
					<span>Keluar Akun</span>
				</button>
			</div>
		</aside>
	);
}
