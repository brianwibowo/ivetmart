import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-10 animate-fade-in">
			{/* Header / Hero Skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-10 w-48 bg-muted" />
				<Skeleton className="h-5 w-96 max-w-full bg-muted/60" />
			</div>

			{/* Grid Skeleton */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
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
