import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-72" />
			</div>
			<Skeleton className="h-44 w-full rounded-xl" />
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Skeleton className="h-32 w-full rounded-xl" />
				<Skeleton className="h-32 w-full rounded-xl" />
			</div>
		</div>
	);
}
