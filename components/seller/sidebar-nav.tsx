/**
 * Seller Sidebar Navigation — Ivet Mart
 *
 * Responsive sidebar navigation for seller dashboard.
 * Links to: Dashboard, Products, Orders, Finance, Settings.
 */

"use client";

import { ChevronRight, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/auth-client";

interface SellerSidebarNavProps {
	storeName?: string;
	storeStatus?: "pending" | "active" | "suspended" | "rejected";
}

export function SellerSidebarNav({ storeName, storeStatus }: SellerSidebarNavProps) {
	const pathname = usePathname();

	const navItems = [
		{
			href: "/seller",
			label: "Dashboard",
			icon: <LayoutDashboard className="h-4 w-4" />,
			exact: true,
		},
		{
			href: "/seller/products",
			label: "Produk Saya",
			icon: <Package className="h-4 w-4" />,
		},
		{
			href: "/seller/orders",
			label: "Pesanan Masuk",
			icon: <ShoppingCart className="h-4 w-4" />,
		},
		{
			href: "/seller/settings",
			label: "Pengaturan Toko",
			icon: <Settings className="h-4 w-4" />,
		},
	];

	return (
		<aside className="w-64 shrink-0 border-r border-border/60 bg-card p-4 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
			<div className="flex flex-col gap-6">
				{/* Store Header Info */}
				<div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-muted/50 border border-border/40">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Store className="h-5 w-5" />
					</div>
					<div className="flex flex-col overflow-hidden">
						<span className="truncate text-sm font-semibold text-foreground">
							{storeName || "Toko Penjual"}
						</span>
						{storeStatus && (
							<div className="mt-0.5">
								{storeStatus === "active" && (
									<Badge
										variant="default"
										className="bg-emerald-600 hover:bg-emerald-700 text-[10px] px-1.5 py-0"
									>
										Aktif / Terverifikasi
									</Badge>
								)}
								{storeStatus === "pending" && (
									<Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0">
										Menunggu Verifikasi
									</Badge>
								)}
								{storeStatus === "suspended" && (
									<Badge variant="destructive" className="text-[10px] px-1.5 py-0">
										Ditangguhkan
									</Badge>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Navigation Links */}
				<nav className="flex flex-col gap-1">
					<span className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Menu Penjual
					</span>
					{navItems.map((item) => {
						const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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

			{/* Logout / Store Front link */}
			<div className="flex flex-col gap-2 pt-4 border-t border-border/40">
				<Link
					href="/"
					className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1.5 transition-colors"
				>
					← Kembali ke Storefront
				</Link>
				<button
					type="button"
					onClick={() => signOut()}
					className="flex items-center gap-2 text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1.5 rounded-md transition-colors w-full text-left"
				>
					<LogOut className="h-3.5 w-3.5" />
					<span>Keluar Akun</span>
				</button>
			</div>
		</aside>
	);
}
