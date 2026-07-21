import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
				<div className="space-y-2">
					<Skeleton className="h-9 w-48 bg-muted" />
					<Skeleton className="h-4 w-72 bg-muted/60" />
				</div>
				<Skeleton className="h-10 w-40 rounded-lg bg-muted" />
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{Array.from({ length: 12 }).map((_, i) => (
					<div key={i} className="space-y-4 rounded-xl border border-border/50 p-4 bg-card">
						<Skeleton className="aspect-square w-full rounded-lg bg-muted" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-3/4 bg-muted" />
							<Skeleton className="h-4 w-1/2 bg-muted/70" />
						</div>
						<div className="pt-2 flex items-center justify-between">
							<Skeleton className="h-6 w-20 bg-muted" />
							<Skeleton className="h-8 w-24 rounded-full bg-muted" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
