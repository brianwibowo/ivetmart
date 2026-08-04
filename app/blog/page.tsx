import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { YnsLink } from "@/components/yns-link";
import { commerce, getCanonicalUrl, meGetCached } from "@/lib/commerce";
import { LOCALE } from "@/lib/constants";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

const POSTS_LIMIT = 24;

export const metadata: Metadata = {
	title: "Blog & Artikel",
	description: "Berita terbaru, panduan UMKM, dan cerita inspiratif dari ekosistem Ivet Mart UNISVET.",
	alternates: { canonical: "/blog" },
	openGraph: {
		type: "website",
		title: "Blog & Artikel — Ivet Mart Marketplace",
		description: "Berita terbaru, panduan UMKM, dan cerita inspiratif dari ekosistem Ivet Mart UNISVET.",
		url: "/blog",
	},
};

async function isBlogEnabled(): Promise<boolean> {
	try {
		const me = await meGetCached();
		return me.store.settings?.enabledTools?.blog ?? false;
	} catch {
		return false;
	}
}

function formatDate(value: string): string {
	return new Date(value).toLocaleDateString(LOCALE, { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage() {
	"use cache";
	cacheLife("minutes");

	if (!(await isBlogEnabled())) {
		notFound();
	}

	const { data: posts } = await commerce.postBrowse({ active: true, limit: POSTS_LIMIT });
	const baseUrl = getCanonicalUrl();

	const blogJsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "Blog Ivet Mart",
		url: `${baseUrl}/blog`,
		blogPost: posts.map((post) => ({
			"@type": "BlogPosting",
			headline: post.title,
			url: `${baseUrl}/blog/${post.slug}`,
			datePublished: post.publishedAt ?? post.createdAt,
			...(post.image ? { image: post.image } : {}),
		})),
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={blogJsonLd} />

			{/* Header */}
			<div className="mb-10">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Beranda</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Blog</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight font-serif text-foreground">
					Blog & Kabar Terbaru
				</h1>
				<p className="mt-3 text-lg text-muted-foreground">
					Berita kampus, panduan wirausaha UMKM Semarang, dan cerita inspiratif dari Ivet Mart.
				</p>
			</div>

			{/* Posts */}
			{posts.length === 0 ? (
				<div className="rounded-2xl border border-border/80 bg-card p-12 text-center shadow-xs">
					<h2 className="text-xl font-bold tracking-tight font-serif text-foreground">Belum Ada Artikel</h2>
					<p className="mt-2 text-muted-foreground text-sm">
						Artikel dan kabar terbaru akan segera dipublikasikan. Silakan kembali lagi nanti!
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{posts.map((post) => (
						<YnsLink key={post.id} prefetch="eager" href={`/blog/${post.slug}`} className="group">
							<div className="relative aspect-[3/2] bg-secondary rounded-2xl overflow-hidden mb-4 border border-border/60 shadow-xs">
								{post.image && (
									<YNSMedia
										src={post.image}
										alt={post.title}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								)}
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-3 text-xs text-muted-foreground">
									{post.tag && (
										<span className="rounded-full bg-[#80070A]/10 text-[#80070A] px-3 py-1 font-semibold">
											{post.tag}
										</span>
									)}
									<time dateTime={post.publishedAt ?? post.createdAt}>
										{formatDate(post.publishedAt ?? post.createdAt)}
									</time>
								</div>
								<h2 className="text-lg font-bold tracking-tight text-foreground group-hover:text-[#80070A] transition-colors font-serif">
									{post.title}
								</h2>
							</div>
						</YnsLink>
					))}
				</div>
			)}
		</div>
	);
}
