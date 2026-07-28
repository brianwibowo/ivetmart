import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AUTH_ENABLED } from "@/lib/auth-config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	if (!AUTH_ENABLED) {
		notFound();
	}

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-[#faf6f2] overflow-hidden">
			{/* Decorative ambient background glows */}
			<div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#80070A]/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#80070A]/10 blur-3xl" />

			{/* Branding Header */}
			<div className="relative z-10 mb-8 flex flex-col items-center text-center">
				<Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-105">
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2 shadow-md ring-1 ring-border/60">
						<Image
							src="/logo.png"
							alt="Ivet Mart Logo"
							width={40}
							height={40}
							className="h-8 w-auto object-contain"
							priority
						/>
					</div>
					<span className="yns-display text-2xl font-bold tracking-tight text-[#80070A]">Ivet Mart</span>
				</Link>
				<p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
					Marketplace Resmi UNISVET
				</p>
			</div>

			{/* Form Container Card */}
			<div className="relative z-10 w-full max-w-md">{children}</div>

			{/* Footer Copyright */}
			<p className="relative z-10 mt-8 text-center text-xs text-muted-foreground">
				&copy; {new Date().getFullYear()} Universitas Ivet Semarang · Hak Cipta Dilindungi
			</p>
		</div>
	);
}
