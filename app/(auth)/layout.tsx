import { ArrowLeft, CheckCircle2, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AUTH_ENABLED } from "@/lib/auth-config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	if (!AUTH_ENABLED) {
		notFound();
	}

	return (
		<div className="flex min-h-screen w-full bg-[#FAF4F0] font-sans antialiased text-foreground">
			{/* Left Column: Brand Hero Showcase (Visible on lg screens) */}
			<div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#3D0305] via-[#80070A] to-[#1A0203] p-12 text-white">
				{/* Background ambient lighting and pattern elements */}
				<div className="pointer-events-none absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-[#F8C300]/15 blur-[120px]" />
				<div className="pointer-events-none absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-[#80070A]/50 blur-[100px]" />
				<div
					className="pointer-events-none absolute inset-0 opacity-10"
					style={{
						backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>

				{/* Top Brand Header */}
				<div className="relative z-10">
					<Link href="/" className="inline-flex items-center gap-3 group">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-xl ring-1 ring-white/20 transition-transform group-hover:scale-105">
							<Image
								src="/logo.png"
								alt="Ivet Mart Logo"
								width={40}
								height={40}
								className="h-8 w-auto object-contain"
								priority
							/>
						</div>
						<div className="flex flex-col">
							<span className="yns-display text-2xl font-bold tracking-tight text-white">Ivet Mart</span>
							<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F8C300]">
								Marketplace Resmi UNISVET
							</span>
						</div>
					</Link>
				</div>

				{/* Center Showcase Content */}
				<div className="relative z-10 my-auto max-w-xl space-y-8 py-10">
					<h1 className="yns-display text-4xl sm:text-5xl font-bold leading-[1.15] text-white tracking-tight">
						Pusat Belanja & Karya Terbaik Mahasiswa <span className="italic text-[#F8C300]">UNISVET</span>.
					</h1>

					<p className="text-base text-white/80 leading-relaxed font-normal">
						Nikmati kemudahan bertransaksi produk kreatif, merchandise resmi universitas, hingga kuliner khas
						Semarang dengan jaminan keamanan dan verifikasi resmi kampus.
					</p>

					{/* Value Proposition Glass Feature Chips */}
					<div className="grid grid-cols-1 gap-3 pt-2">
						<div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md ring-1 ring-white/15 transition-all hover:bg-white/15">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8C300] text-[#80070A]">
								<ShieldCheck className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-sm font-bold text-white">100% Produk Terverifikasi</h3>
								<p className="text-xs text-white/70">
									Dikurasi langsung oleh pengelola platform & penjual terdaftar.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md ring-1 ring-white/15 transition-all hover:bg-white/15">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-[#F8C300]">
								<ShoppingBag className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-sm font-bold text-white">Dukungan Produk Lokal</h3>
								<p className="text-xs text-white/70">
									Mendukung karya kewirausahaan mahasiswa Universitas Ivet.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="relative z-10 flex items-center justify-between text-xs text-white/60">
					<p>&copy; 2026 Universitas Ivet Semarang</p>
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-4 w-4 text-[#F8C300]" />
						<span>Hak Cipta Dilindungi</span>
					</div>
				</div>
			</div>

			{/* Right Column: Dedicated Auth Form Area */}
			<div className="flex w-full lg:w-1/2 flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#FAF4F0] min-h-screen">
				{/* Top Action Bar */}
				<div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#80070A] shadow-sm ring-1 ring-border/80 transition-all hover:bg-[#F7E6E6] hover:shadow-md"
					>
						<ArrowLeft className="h-3.5 w-3.5" />
						<span>Kembali ke Beranda</span>
					</Link>

					{/* Mobile Brand Logo (Visible only on small screens) */}
					<div className="flex lg:hidden items-center gap-2">
						<Image src="/logo.png" alt="Logo" width={28} height={28} className="h-7 w-auto object-contain" />
						<span className="yns-display text-lg font-bold text-[#80070A]">Ivet Mart</span>
					</div>
				</div>

				{/* Center Main Form */}
				<div className="w-full max-w-md mx-auto my-auto">{children}</div>

				{/* Bottom Mobile Footer */}
				<p className="mt-8 text-center text-xs text-muted-foreground lg:hidden">
					&copy; 2026 Universitas Ivet Semarang · Hak Cipta Dilindungi
				</p>
			</div>
		</div>
	);
}
