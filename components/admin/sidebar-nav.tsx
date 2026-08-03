/**
 * Admin Sidebar Navigation — Ivet Mart
 *
 * Navigation sidebar for the platform admin panel.
 * Shows pending seller verification counter badge.
 */

"use client";

import {
	ChevronRight,
	FolderTree,
	Home,
	LayoutDashboard,
	LogOut,
	Package,
	Settings,
	ShieldCheck,
	ShoppingCart,
	Store,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/auth-client";

interface AdminSidebarNavProps {
	pendingSellersCount?: number;
}

export function AdminSidebarNav({ pendingSellersCount = 0 }: AdminSidebarNavProps) {
	const pathname = usePathname();

	const navItems = [
		{
			href: "/admin",
			label: "Overview",
			icon: <LayoutDashboard className="h-4 w-4" />,
			exact: true,
		},
		{
			href: "/admin/sellers",
			label: "Verifikasi Penjual",
			icon: <Store className="h-4 w-4" />,
			badge: pendingSellersCount > 0 ? pendingSellersCount : undefined,
		},
		{
			href: "/admin/users",
			label: "Pengguna",
			icon: <Users className="h-4 w-4" />,
		},
		{
			href: "/admin/products",
			label: "Moderasi Produk",
			icon: <Package className="h-4 w-4" />,
		},
		{
			href: "/admin/orders",
			label: "Semua Pesanan",
			icon: <ShoppingCart className="h-4 w-4" />,
		},
		{
			href: "/admin/categories",
			label: "Kategori",
			icon: <FolderTree className="h-4 w-4" />,
		},
		{
			href: "/admin/settings",
			label: "Pengaturan Platform",
			icon: <Settings className="h-4 w-4" />,
		},
	];

	return (
		<aside className="w-64 shrink-0 border-r border-border/60 bg-card p-4 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
			<div className="flex flex-col gap-6">
				{/* Admin Header Badge */}
				<div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 border border-primary/20">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<ShieldCheck className="h-5 w-5" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-semibold uppercase tracking-wider text-primary">Panel Admin</span>
						<span className="text-sm font-bold text-foreground">Ivet Mart Platform</span>
					</div>
				</div>

				{/* Navigation Links */}
				<nav className="flex flex-col gap-1">
					<span className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Administrasi
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
								<div className="flex items-center gap-1.5">
									{item.badge !== undefined && (
										<Badge
											variant="secondary"
											className="bg-amber-500 text-white hover:bg-amber-600 text-[10px] px-1.5 py-0 font-bold animate-pulse"
										>
											{item.badge}
										</Badge>
									)}
									{isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
								</div>
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Bottom Links */}
			<div className="flex flex-col gap-1.5 pt-4 border-t border-border/40">
				<Link
					href="/"
					className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-md hover:bg-secondary/60 transition-colors"
				>
					<Home className="h-3.5 w-3.5 text-primary" />
					<span>Beranda Marketplace</span>
				</Link>
				<button
					type="button"
					onClick={async () => {
						toast.info("Anda telah keluar dari akun");
						await signOut();
						window.location.href = "/";
					}}
					className="flex items-center gap-2 text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1.5 rounded-md transition-colors w-full text-left cursor-pointer"
				>
					<LogOut className="h-3.5 w-3.5" />
					<span>Keluar Admin</span>
				</button>
			</div>
		</aside>
	);
}
