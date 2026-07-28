import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerOrdersLoading() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-64" />
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-32" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="p-4 rounded-lg border border-border/60 space-y-3">
							<div className="flex justify-between">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-6 w-20 rounded-full" />
							</div>
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-4 w-36" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
