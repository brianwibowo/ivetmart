/**
 * Data Table Pagination Navigation — Ivet Mart
 *
 * Renders page controls (?page=1, ?page=2) with total items info.
 */

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
}

export function DataTablePagination({
	currentPage,
	totalPages,
	totalItems,
	pageSize,
}: DataTablePaginationProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (totalPages <= 1) return null;

	const createPageUrl = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		return `${pathname}?${params.toString()}`;
	};

	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
			<p className="text-xs text-muted-foreground">
				Menampilkan <strong className="text-foreground">{startItem}</strong> -{" "}
				<strong className="text-foreground">{endItem}</strong> dari{" "}
				<strong className="text-foreground">{totalItems}</strong> data
			</p>
			<div className="flex items-center gap-1.5">
				<Button
					asChild
					variant="outline"
					size="sm"
					disabled={currentPage <= 1}
					className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
				>
					<Link href={createPageUrl(currentPage - 1)}>
						<ChevronLeft className="h-4 w-4 mr-1" />
						Sebelumnya
					</Link>
				</Button>
				<span className="text-xs px-2 font-medium">
					{currentPage} / {totalPages}
				</span>
				<Button
					asChild
					variant="outline"
					size="sm"
					disabled={currentPage >= totalPages}
					className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
				>
					<Link href={createPageUrl(currentPage + 1)}>
						Selanjutnya
						<ChevronRight className="h-4 w-4 ml-1" />
					</Link>
				</Button>
			</div>
		</div>
	);
}
