/**
 * Admin Platform Settings Page — Ivet Mart
 *
 * Form for platform configuration (store name, announcement bar, currency).
 * Uses ActionForm + SubmitButton for toast feedback.
 */

import { Save, Settings } from "lucide-react";
import { updatePlatformSettingsAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/ui/action-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { platformSettings } from "@/lib/db/schema";

export default async function AdminSettingsPage() {
	await requireAdmin();

	const allSettings = await db.select().from(platformSettings);
	const settingsMap = new Map(allSettings.map((s) => [s.key, s.value]));

	const storeName = (settingsMap.get("store_name") as string) || "Ivet Mart";
	const announcementBar =
		(settingsMap.get("announcement_bar") as string) ||
		"Selamat Datang di Ivet Mart — Pusat Produk Khas Semarang & Merchandise Resmi UNISVET";

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">Pengaturan Platform</h1>
				<p className="text-sm text-muted-foreground">Konfigurasi global platform marketplace Ivet Mart.</p>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Settings className="h-5 w-5 text-primary" />
						Identitas & Pengumuman Marketplace
					</CardTitle>
					<CardDescription>
						Teks pengumuman di bagian paling atas situs web dan nama platform.
					</CardDescription>
				</CardHeader>
				<ActionForm action={updatePlatformSettingsAction}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="setting-store-name">
								Nama Platform Marketplace <span className="text-destructive">*</span>
							</Label>
							<Input id="setting-store-name" name="storeName" defaultValue={storeName} required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="setting-announcement">Teks Announcement Bar (Running Text Banner)</Label>
							<Textarea
								id="setting-announcement"
								name="announcementBar"
								defaultValue={announcementBar}
								rows={3}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex justify-end pt-4 border-t border-border/40">
						<SubmitButton loadingText="Menyimpan...">
							<Save className="h-4 w-4 mr-1.5" />
							Simpan Pengaturan Platform
						</SubmitButton>
					</CardFooter>
				</ActionForm>
			</Card>
		</div>
	);
}
