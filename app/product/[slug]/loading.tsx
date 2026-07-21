import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-12">
			{/* Main Product Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
				{/* Gallery Skeleton */}
				<div className="space-y-4">
					<Skeleton className="aspect-square w-full rounded-2xl bg-muted" />
					<div className="flex gap-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-20 w-20 rounded-lg bg-muted/70 shrink-0" />
						))}
					</div>
				</div>

				{/* Product Info Skeleton */}
				<div className="space-y-6">
					<Skeleton className="h-4 w-32 bg-muted/60" />
					<Skeleton className="h-10 w-4/5 bg-muted" />
					<Skeleton className="h-6 w-24 bg-muted" />
					<div className="space-y-2 pt-4 border-t border-border">
						<Skeleton className="h-4 w-full bg-muted/70" />
						<Skeleton className="h-4 w-5/6 bg-muted/70" />
						<Skeleton className="h-4 w-2/3 bg-muted/70" />
					</div>
					<div className="pt-6 space-y-4">
						<Skeleton className="h-12 w-full rounded-full bg-muted" />
						<Skeleton className="h-12 w-full rounded-full bg-muted/50" />
					</div>
				</div>
			</div>
		</div>
	);
}
