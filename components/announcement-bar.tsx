import { Truck } from "lucide-react";

const items = [
	"Selamat Datang di Ivet Mart — Marketplace Resmi Civitas UNISVET",
	"Produk Khas Semarang & Merchandise Eksklusif UNISVET",
	"Gratis Pengiriman Wilayah Semarang & Kampus UNISVET",
	"Dapatkan Penawaran Terbaik Setiap Hari di Ivet Mart",
];

export function AnnouncementBar() {
	return (
		<div className="bg-[#580507] text-[#F8C300] text-[12px] tracking-[0.18em] uppercase font-medium">
			<div className="relative overflow-hidden">
				<div className="flex whitespace-nowrap yns-marquee py-2.5">
					{[...items, ...items, ...items].map((item, idx) => (
						<span key={idx} className="flex items-center gap-3 px-8 shrink-0">
							<Truck className="h-3 w-3 opacity-60" />
							{item}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
