import { Skeleton } from "@/components/ui/skeleton";

export default function AccountAddressesLoading() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
			<div className="lg:col-span-2 space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-52" />
					<Skeleton className="h-4 w-72" />
				</div>
				<Skeleton className="h-60 w-full rounded-xl" />
			</div>
			<div className="space-y-6">
				<Skeleton className="h-96 w-full rounded-xl" />
			</div>
		</div>
	);
}
