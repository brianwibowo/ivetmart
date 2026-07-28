/**
 * Buyer Account Layout — Ivet Mart
 *
 * Protected layout for authenticated buyer account pages.
 */

import { BuyerAccountSidebarNav } from "@/components/account/sidebar-nav";
import { requireAuth } from "@/lib/auth-guard";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
	await requireAuth();

	return (
		<div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-background">
			<BuyerAccountSidebarNav />
			<main className="flex-1 p-4 md:p-8 max-w-5xl overflow-x-hidden">{children}</main>
		</div>
	);
}
