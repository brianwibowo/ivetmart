/**
 * Admin Panel Protected Layout — Ivet Mart
 *
 * Enforces admin role check server-side.
 * Renders AdminSidebarNav with live pending seller count.
 */

import { AdminSidebarNav } from "@/components/admin/sidebar-nav";
import { requireAdmin } from "@/lib/auth-guard";
import { getPendingSellers } from "@/lib/db/queries/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	await requireAdmin();

	const pendingSellers = await getPendingSellers();
	const pendingCount = pendingSellers.length;

	return (
		<div className="flex min-h-[calc(100vh-4rem)] bg-background">
			<AdminSidebarNav pendingSellersCount={pendingCount} />
			<main className="flex-1 p-6 md:p-8 max-w-7xl overflow-x-hidden">{children}</main>
		</div>
	);
}
