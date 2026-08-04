"use client";

import { AlertCircleIcon } from "lucide-react";
import { YnsLink } from "@/components/yns-link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
			style={{ minHeight: "90vh" }}
		>
			<AlertCircleIcon className="size-16 text-destructive/60" strokeWidth={1.5} />
			<h1 className="mt-6 text-4xl font-bold tracking-tight font-serif text-foreground">
				Terjadi Kendala Teknis
			</h1>
			<h2 className="mt-2 text-lg text-muted-foreground font-medium">Mohon Maaf, Ada Kesalahan Sementara</h2>
			<p className="mt-2 text-sm text-muted-foreground max-w-md">
				Sistem mengalami kendala tak terduga. Silakan coba muat ulang halaman atau kembali ke beranda Ivet
				Mart.
			</p>
			<div className="mt-8 flex items-center gap-4">
				<button
					type="button"
					onClick={reset}
					className="inline-flex items-center rounded-full bg-[#80070A] hover:bg-[#680508] text-white px-5 py-2.5 text-sm font-semibold transition-all shadow-xs"
				>
					Coba Muat Ulang
				</button>
				<YnsLink
					href="/"
					className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-all hover:bg-secondary"
				>
					🏠 Beranda Marketplace
				</YnsLink>
			</div>
		</div>
	);
}
