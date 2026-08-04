import { ShoppingCartIcon } from "lucide-react";
import type { Metadata } from "next";
import { YnsLink } from "@/components/yns-link";

export const metadata: Metadata = {
	title: "Halaman Tidak Ditemukan",
	description:
		"Halaman yang Anda cari tidak ditemukan atau telah dipindahkan. Jelajahi produk pilihan di Ivet Mart.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
			style={{ minHeight: "90vh" }}
		>
			<ShoppingCartIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
			<h1 className="mt-6 text-6xl font-bold tracking-tight font-serif text-[#80070A]">404</h1>
			<h2 className="mt-2 text-xl font-bold text-foreground">Halaman Tidak Ditemukan</h2>
			<p className="mt-2 text-sm text-muted-foreground max-w-md">
				Halaman yang Anda cari tidak ditemukan atau telah dipindahkan. Namun seluruh katalog produk Ivet Mart
				tetap buka!
			</p>
			<YnsLink
				href="/"
				className="mt-8 inline-flex items-center rounded-full bg-[#80070A] hover:bg-[#680508] text-white px-6 py-2.5 text-sm font-semibold transition-all shadow-xs"
			>
				🏠 Kembali Belanja ke Beranda
			</YnsLink>
		</div>
	);
}
