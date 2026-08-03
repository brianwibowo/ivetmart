"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type QuickFilter = {
	label: string;
	param: string;
	value: string;
	icon?: string;
};

const STATIC_FILTERS: QuickFilter[] = [
	{ label: "Semua", param: "", value: "" },
	{ label: "🔥 Terlaris", param: "sort", value: "bestsellers" },
	{ label: "⭐ Terbaru", param: "sort", value: "newest" },
];

export function ProductQuickFilters({ collections }: { collections: Array<{ slug: string; name: string }> }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentSort = searchParams.get("sort") ?? "";
	const currentCollection = searchParams.get("collection") ?? "";

	const collectionFilters: QuickFilter[] = collections.map((c) => ({
		label: `🎓 ${c.name}`,
		param: "collection",
		value: c.slug,
	}));

	const allFilters = [...STATIC_FILTERS, ...collectionFilters];

	const isActive = (filter: QuickFilter) => {
		if (filter.param === "" && filter.value === "") {
			return currentSort === "" && currentCollection === "";
		}
		if (filter.param === "sort") {
			return currentSort === filter.value && currentCollection === "";
		}
		if (filter.param === "collection") {
			return currentCollection === filter.value;
		}
		return false;
	};

	const handleClick = (filter: QuickFilter) => {
		const params = new URLSearchParams(searchParams.toString());
		// Reset pagination on filter change
		params.delete("page");

		if (filter.param === "" && filter.value === "") {
			// "Semua" — clear sort and collection
			params.delete("sort");
			params.delete("collection");
		} else if (filter.param === "sort") {
			params.delete("collection");
			if (filter.value === "newest") {
				params.delete("sort"); // newest is default
			} else {
				params.set("sort", filter.value);
			}
		} else if (filter.param === "collection") {
			params.delete("sort");
			params.set("collection", filter.value);
		}

		const qs = params.toString();
		router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	};

	return (
		<div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
			<div className="flex items-center gap-2 min-w-max pb-1">
				{allFilters.map((filter) => {
					const active = isActive(filter);
					return (
						<button
							key={`${filter.param}-${filter.value}`}
							type="button"
							onClick={() => handleClick(filter)}
							className={cn(
								"inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all",
								active
									? "bg-[#80070A] text-white shadow-sm"
									: "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40",
							)}
						>
							{filter.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
