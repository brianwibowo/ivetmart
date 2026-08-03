"use client";

import { usePathname } from "next/navigation";

export function StorefrontWrapper({
	children,
	header,
	footer,
	announcement,
	referralBadge,
}: {
	children: React.ReactNode;
	header: React.ReactNode;
	footer: React.ReactNode;
	announcement: React.ReactNode;
	referralBadge: React.ReactNode;
}) {
	const pathname = usePathname();
	const isStandalone =
		pathname.startsWith("/admin") ||
		pathname.startsWith("/seller") ||
		pathname.startsWith("/login") ||
		pathname.startsWith("/signup");

	if (isStandalone) {
		return <div className="flex min-h-screen flex-col bg-background">{children}</div>;
	}

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{announcement}
			{header}
			<div className="flex-1">{children}</div>
			{footer}
			{referralBadge}
		</div>
	);
}
