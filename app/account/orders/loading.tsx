import { Skeleton } from "@/components/ui/skeleton";

export default function AccountOrdersLoading() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="space-y-2">
				<Skeleton className="h-8 w-56" />
				<Skeleton className="h-4 w-80" />
			</div>
			<div className="space-y-4">
				<Skeleton className="h-40 w-full rounded-xl" />
				<Skeleton className="h-40 w-full rounded-xl" />
			</div>
		</div>
	);
}
