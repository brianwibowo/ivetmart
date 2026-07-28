import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoriesLoading() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="space-y-2">
				<Skeleton className="h-8 w-56" />
				<Skeleton className="h-4 w-72" />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<Skeleton className="h-80 w-full rounded-xl" />
				</div>
				<div>
					<Skeleton className="h-64 w-full rounded-xl" />
				</div>
			</div>
		</div>
	);
}
