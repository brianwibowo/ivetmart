/**
 * Seller Dashboard Layout — Ivet Mart
 *
 * Protected layout for seller dashboard.
 * Checks authentication & store registration status before rendering.
 */

import { SellerSidebarNav } from "@/components/seller/sidebar-nav";
import { requireAuth } from "@/lib/auth-guard";
import { getSellerStoreByUserId } from "@/lib/db/queries/seller";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
	const session = await requireAuth();

	// Check if user has a store
	const store = await getSellerStoreByUserId(session.user.id);

	return (
		<div className="flex min-h-[calc(100vh-4rem)] bg-background">
			<SellerSidebarNav storeName={store?.name} storeStatus={store?.status} />
			<main className="flex-1 p-6 md:p-8 max-w-7xl overflow-x-hidden">{children}</main>
		</div>
	);
}
