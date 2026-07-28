/**
 * Buyer Account Overview Page — Ivet Mart
 *
 * Profile overview for logged-in user.
 */

import { MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-guard";

export default async function AccountPage() {
	const session = await requireAuth();
	const user = session.user;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Profil Saya</h1>
				<p className="text-sm text-muted-foreground">
					Kelola informasi pribadi dan pengaturan akun Ivet Mart Anda.
				</p>
			</div>

			<Card className="border-border/60">
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
							{user.name.charAt(0).toUpperCase()}
						</div>
						<div>
							<CardTitle className="text-lg">{user.name}</CardTitle>
							<CardDescription>{user.email}</CardDescription>
						</div>
					</div>
					<Badge variant="outline" className="capitalize text-xs">
						Role: {user.role || "Pembeli"}
					</Badge>
				</CardHeader>
				<CardContent className="space-y-4 pt-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
						<div className="p-3 rounded-lg bg-muted/40 border border-border/40">
							<span className="text-xs text-muted-foreground block">Nama Lengkap</span>
							<span className="font-semibold text-foreground">{user.name}</span>
						</div>
						<div className="p-3 rounded-lg bg-muted/40 border border-border/40">
							<span className="text-xs text-muted-foreground block">Email</span>
							<span className="font-semibold text-foreground">{user.email}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Shortcut Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Card className="border-border/60 hover:border-primary/40 transition-colors">
					<CardHeader className="pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<ShoppingBag className="h-5 w-5 text-primary" />
							Riwayat Pesanan
						</CardTitle>
						<CardDescription className="text-xs">
							Cek status pesanan, nomor resi pengiriman, dan riwayat belanja.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild variant="outline" size="sm" className="w-full">
							<Link href="/account/orders">Lihat Riwayat Pesanan</Link>
						</Button>
					</CardContent>
				</Card>

				<Card className="border-border/60 hover:border-primary/40 transition-colors">
					<CardHeader className="pb-3">
						<CardTitle className="text-base flex items-center gap-2">
							<MapPin className="h-5 w-5 text-primary" />
							Alamat Pengiriman
						</CardTitle>
						<CardDescription className="text-xs">
							Kelola alamat pengiriman rumah dan kantor Anda.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild variant="outline" size="sm" className="w-full">
							<Link href="/account/addresses">Kelola Alamat</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
