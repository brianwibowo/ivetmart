import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { type FAQCategory, faqCategories } from "@/app/faq/faq-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { YnsLink } from "@/components/yns-link";
import { JsonLdScript } from "@/lib/json-ld";

export const metadata: Metadata = {
	title: "Pusat Bantuan & FAQ",
	description:
		"Jawaban atas pertanyaan umum seputar pemesanan, pembayaran, pengiriman, pendaftaran toko, dan pengembalian di Ivet Mart.",
	alternates: { canonical: "/faq" },
	openGraph: {
		type: "website",
		title: "Pusat Bantuan & FAQ — Ivet Mart Marketplace",
		description:
			"Jawaban atas pertanyaan umum seputar pemesanan, pembayaran, pengiriman, pendaftaran toko, dan pengembalian di Ivet Mart.",
		url: "/faq",
	},
};

function buildFaqJsonLd(categories: FAQCategory[]): Record<string, unknown> {
	const mainEntity = categories.flatMap((category) =>
		category.questions.map((q) => ({
			"@type": "Question",
			name: q.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: q.answer,
			},
		})),
	);

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity,
	};
}

function CategoryNav({ categories }: { categories: FAQCategory[] }) {
	return (
		<nav className="flex flex-wrap gap-2">
			{categories.map((category) => (
				<a
					key={category.id}
					href={`#${category.id}`}
					className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-[#80070A] hover:text-white hover:border-[#80070A]"
				>
					{category.title}
				</a>
			))}
		</nav>
	);
}

function FAQSection({ category }: { category: FAQCategory }) {
	return (
		<section id={category.id} className="scroll-mt-24">
			<h2 className="text-2xl font-bold tracking-tight mb-4 font-serif text-foreground">{category.title}</h2>
			<Accordion
				type="single"
				collapsible
				className="rounded-2xl border border-border/80 bg-card px-4 shadow-xs"
			>
				{category.questions.map((item, index) => (
					<AccordionItem key={`${category.id}-${index}`} value={`${category.id}-${index}`}>
						<AccordionTrigger className="text-base font-semibold hover:no-underline text-left">
							{item.question}
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}

function ContactCard() {
	return (
		<div className="rounded-2xl border border-border/80 bg-gradient-to-br from-[#80070A]/5 via-background to-amber-500/5 p-8 text-center shadow-xs">
			<h2 className="text-2xl font-bold tracking-tight font-serif">Masih Punya Pertanyaan Lain?</h2>
			<p className="mt-2 text-muted-foreground max-w-md mx-auto text-sm">
				Tim Bantuan Ivet Mart siap membantu Anda. Silakan hubungi kami untuk informasi lebih lanjut.
			</p>
			<div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground shadow-xs">
				<Mail className="h-4 w-4 text-[#80070A]" />
				<span>Kontak: support@techno-ivetmart.id</span>
			</div>
		</div>
	);
}

export default function FAQPage() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<JsonLdScript data={buildFaqJsonLd(faqCategories)} />
			{/* Header */}
			<div className="mb-10">
				<YnsLink
					prefetch="eager"
					href="/"
					className="text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Beranda
				</YnsLink>
				<span className="mx-2 text-muted-foreground">/</span>
				<span className="text-sm text-foreground font-medium">Bantuan</span>
				<h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight font-serif text-foreground">
					Pusat Bantuan & FAQ
				</h1>
				<p className="mt-3 text-lg text-muted-foreground leading-relaxed">
					Temukan jawaban lengkap atas pertanyaan umum seputar pesanan, pembayaran, pengiriman, dan
					pendaftaran toko.
				</p>
			</div>

			{/* Category Navigation */}
			<div className="mb-10">
				<CategoryNav categories={faqCategories} />
			</div>

			{/* FAQ Sections */}
			<div className="space-y-12">
				{faqCategories.map((category) => (
					<FAQSection key={category.id} category={category} />
				))}
			</div>

			{/* Contact Card */}
			<div className="mt-16">
				<ContactCard />
			</div>
		</div>
	);
}
