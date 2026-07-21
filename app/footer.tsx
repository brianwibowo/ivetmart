import { Camera, Mail } from "lucide-react";
import { cacheLife } from "next/cache";
import { DitherBackground } from "@/components/dither-background";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/blog"
				className="text-sm text-background/80 hover:text-background transition-colors"
			>
				Blog
			</YnsLink>
		</li>
	);
}

async function FooterContactLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.contactForm) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/contact"
				className="text-sm text-background/80 hover:text-background transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-xs tracking-[0.22em] uppercase text-white/70 font-semibold">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/80 hover:text-white transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-xs tracking-[0.22em] uppercase text-white/70 font-semibold">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/80 hover:text-white transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="relative bg-[#1a0203] text-white mt-20 overflow-hidden">
			<DitherBackground />
			<div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-10">
				{/* Big display word */}
				<p className="yns-display text-white leading-[0.85] tracking-[-0.04em] text-[18vw] sm:text-[14vw] lg:text-[12vw] font-medium">
					<span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
						Ivet Mart
					</span>
				</p>

				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 mt-16">
					<div className="col-span-2 md:col-span-2 sm:max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="yns-display text-2xl text-white font-bold">
							IM
						</YnsLink>
						<p className="mt-4 text-sm text-white/80 leading-relaxed font-normal">
							Marketplace resmi civitas Universitas Ivet Semarang — Menghadirkan produk khas Semarang dan merchandise eksklusif UNISVET.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/30 text-white hover:bg-white/10 transition-colors"
								aria-label="Instagram"
							>
								<Camera className="h-4 w-4" />
							</a>
							<a
								href="mailto:ivetmart@unisvet.ac.id"
								className="inline-flex h-10 items-center gap-2 rounded-full ring-1 ring-white/30 text-white hover:bg-white/10 transition-colors px-4 text-sm"
							>
								<Mail className="h-4 w-4" />
								ivetmart@unisvet.ac.id
							</a>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs tracking-[0.22em] uppercase text-white/70 font-semibold">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-white/80 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-white/80 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/cart"
									className="text-sm text-white/80 hover:text-white transition-colors"
								>
									Returns
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:ivetmart@unisvet.ac.id"
									className="text-sm text-white/80 hover:text-white transition-colors"
								>
									Contact us
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-16 pt-6 border-t border-white/15 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
					<p className="text-xs text-white/70">
						&copy; {new Date().getFullYear()} Ivet Mart. All rights reserved.
					</p>
					<p className="text-xs text-white/70 tracking-[0.18em] uppercase font-medium">
						Designed quietly · Made to last
					</p>
				</div>
			</div>
		</footer>
	);
}
