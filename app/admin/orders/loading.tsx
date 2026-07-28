import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersLoading() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="space-y-2">
				<Skeleton className="h-8 w-56" />
				<Skeleton className="h-4 w-72" />
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-32" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex justify-between items-center py-2.5 border-b border-border/40">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-6 w-20 rounded-full" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
