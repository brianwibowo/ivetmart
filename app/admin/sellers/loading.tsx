import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSellersLoading() {
	return (
		<div className="space-y-6 animate-in fade-in-50 duration-300">
			<div className="space-y-2">
				<Skeleton className="h-8 w-60" />
				<Skeleton className="h-4 w-72" />
			</div>

			<Skeleton className="h-10 w-80 rounded-lg" />

			<Card className="border-border/60">
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-40" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="p-4 rounded-lg border border-border/60 flex justify-between items-center">
							<div className="space-y-2">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-4 w-60" />
								<Skeleton className="h-3 w-36" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-9 w-24" />
								<Skeleton className="h-9 w-20" />
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
