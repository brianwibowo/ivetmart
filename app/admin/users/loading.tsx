import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-72" />
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<Skeleton className="h-6 w-44" />
					<Skeleton className="h-4 w-32" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex justify-between items-center py-2 border-b border-border/40">
							<div className="space-y-1">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-40" />
							</div>
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-16 rounded-full" />
							<Skeleton className="h-6 w-16 rounded-full" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-8 w-20" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
