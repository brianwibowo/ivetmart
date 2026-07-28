/**
 * Seller Loading Skeleton — Ivet Mart
 *
 * Rendered automatically by Next.js App Router during page transitions.
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerDashboardLoading() {
	return (
		<div className="space-y-8 animate-in fade-in-50 duration-300">
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-48" />
			</div>

			{/* Metric Cards Skeleton */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{[1, 2, 3].map((i) => (
					<Card key={i} className="border-border/60">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4 rounded-full" />
						</CardHeader>
						<CardContent className="space-y-2">
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-3 w-32" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Table Skeleton */}
			<Card className="border-border/60">
				<CardHeader>
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-60" />
				</CardHeader>
				<CardContent className="space-y-3">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-5 w-16" />
							<Skeleton className="h-8 w-16" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
