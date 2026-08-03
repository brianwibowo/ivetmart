/**
 * Seller Pending Verification Page — Ivet Mart
 *
 * Notice page shown when a store is awaiting Admin approval.
 */

import { ArrowLeft, CheckCircle2, Clock, Store } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-guard";
import { getSellerStoreByUserId } from "@/lib/db/queries/seller";

export default async function SellerPendingPage() {
	const session = await requireAuth();
	const store = await getSellerStoreByUserId(session.user.id);

	if (!store) {
		redirect("/seller/register");
	}

	if (store.status === "active") {
		redirect("/seller");
	}

	return (
		<div className="max-w-xl mx-auto py-12 text-center">
			<div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-4 animate-pulse">
				<Clock className="h-8 w-8" />
			</div>

			<h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
				Toko Dalam Proses Verifikasi
			</h1>
			<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
				Pendaftaran toko <strong className="text-foreground">{store.name}</strong> berhasil dikirim. Admin
				Ivet Mart sedang meninjau informasi toko Anda.
			</p>

			<Card className="mt-8 text-left border-amber-200/60 bg-amber-50/30 dark:bg-amber-950/10">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-base flex items-center gap-2">
							<Store className="h-4 w-4 text-primary" />
							Detail Pengajuan
						</CardTitle>
						<Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
							Pending Admin Review
						</Badge>
					</div>
					<CardDescription>Proses peninjauan biasanya membutuhkan waktu 1 x 24 jam kerja.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 text-xs text-muted-foreground">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
						<span>Formulir toko diterima</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-amber-600 shrink-0" />
						<span>Peninjauan identitas & lokasi toko oleh Admin</span>
					</div>
					<div className="flex items-center gap-2 opacity-50">
						<CheckCircle2 className="h-4 w-4 shrink-0" />
						<span>Aktivasi toko & siap menambah produk</span>
					</div>
				</CardContent>
				<CardFooter className="pt-3 border-t border-border/40 flex justify-between items-center text-xs">
					<span className="text-muted-foreground">
						Dikirim pada: {store.createdAt ? new Date(store.createdAt).toLocaleDateString("id-ID") : "-"}
					</span>
					<Button asChild variant="outline" size="sm">
						<Link href="/">
							<ArrowLeft className="h-3.5 w-3.5 mr-1" />
							Beranda Marketplace
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
