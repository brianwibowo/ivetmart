"use client";

import { Menu, Store } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { YnsLink } from "@/components/yns-link";
import { MobileSearchInput } from "./search-input";

export type NavLink = {
	href: string;
	label: string;
	variant?: "default" | "cta";
};

export function Navbar({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const isLinkActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<button
						type="button"
						aria-label="Open menu"
						className="-order-1 rounded-full p-2 transition-colors hover:bg-secondary lg:hidden"
					>
						<Menu className="h-6 w-6" />
					</button>
				</SheetTrigger>
				<SheetContent side="left" className="gap-0 overflow-y-auto p-6">
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<div className="mt-6">
						<MobileSearchInput onNavigate={() => setOpen(false)} />
					</div>
					<nav className="mt-4 flex flex-col gap-1">
						{links.map((link) => {
							const active = isLinkActive(link.href);
							const isCta = link.variant === "cta";
							return (
								<YnsLink
									key={link.href}
									prefetch="eager"
									href={link.href}
									onClick={() => setOpen(false)}
									className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
										isCta
											? "flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:shadow-md"
											: active
												? "bg-[#80070A] text-white shadow-sm"
												: "text-foreground hover:bg-secondary"
									}`}
								>
									{isCta && <Store className="h-4 w-4" />}
									{link.label}
								</YnsLink>
							);
						})}
					</nav>
				</SheetContent>
			</Sheet>
			<nav className="hidden lg:flex items-center gap-1.5 bg-secondary/40 p-1 rounded-full border border-border/50">
				{links.map((link) => {
					const active = isLinkActive(link.href);
					const isCta = link.variant === "cta";
					return (
						<YnsLink
							key={link.href}
							prefetch={"eager"}
							href={link.href}
							className={`h-9 px-4 rounded-full flex items-center text-sm font-medium whitespace-nowrap transition-all ${
								isCta
									? "gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-sm hover:shadow-md hover:brightness-110"
									: active
										? "bg-[#80070A] text-white font-semibold shadow-sm"
										: "text-muted-foreground hover:text-foreground hover:bg-background/80"
							}`}
						>
							{isCta && <Store className="h-3.5 w-3.5" />}
							{link.label}
						</YnsLink>
					);
				})}
			</nav>
		</>
	);
}
