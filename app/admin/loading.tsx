import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
	return (
		<div className="space-y-8 animate-in fade-in-50 duration-300">
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-56" />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Card key={i} className="border-border/60">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-4 w-4 rounded-full" />
						</CardHeader>
						<CardContent className="space-y-2">
							<Skeleton className="h-7 w-16" />
							<Skeleton className="h-3 w-24" />
						</CardContent>
					</Card>
				))}
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex justify-between items-center py-2 border-b border-border/40">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-8 w-24" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
