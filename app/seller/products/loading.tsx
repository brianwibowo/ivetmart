import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerProductsLoading() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-9 w-36" />
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-32" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex items-center justify-between py-3 border-b border-border/40">
							<div className="flex items-center gap-3">
								<Skeleton className="h-12 w-12 rounded-lg" />
								<div className="space-y-1">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-3 w-20" />
								</div>
							</div>
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-6 w-16 rounded-full" />
							<Skeleton className="h-8 w-20" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
