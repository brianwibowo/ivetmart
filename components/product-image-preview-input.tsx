"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SAMPLE_IMAGES = [
	{ label: "Lumpia Semarang", url: "/products/lumpia-semarang.png" },
	{ label: "Bandeng Presto", url: "/products/bandeng-presto.png" },
	{ label: "Batik Semarang", url: "/products/batik-semarang.png" },
	{ label: "Merchandise UNISVET", url: "/scraped-5.jpg" },
];

export function ProductImagePreviewInput() {
	const [imageUrl, setImageUrl] = useState("/products/lumpia-semarang.png");

	return (
		<div className="space-y-3">
			<Label htmlFor="prod-image">
				URL Gambar Produk <span className="text-destructive">*</span>
			</Label>

			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				{/* Image Thumbnail Preview */}
				<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted/50 shadow-inner">
					<Image
						src={imageUrl || "/products/lumpia-semarang.png"}
						alt="Pratinjau gambar produk"
						fill
						className="object-cover"
						onError={() => setImageUrl("/products/lumpia-semarang.png")}
					/>
				</div>

				<div className="space-y-2 flex-1 w-full">
					<Input
						id="prod-image"
						name="imageUrl"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						placeholder="https://... atau /products/..."
						required
					/>
					<p className="text-xs text-muted-foreground">
						Masukkan URL gambar produk atau pilih dari sampel cepat di bawah.
					</p>

					{/* Preset Buttons */}
					<div className="flex flex-wrap items-center gap-1.5 pt-1">
						<span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
							<Sparkles className="h-3 w-3 text-amber-500" /> Contoh:
						</span>
						{SAMPLE_IMAGES.map((img) => (
							<button
								key={img.url}
								type="button"
								onClick={() => setImageUrl(img.url)}
								className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground font-medium transition-colors border border-border/40"
							>
								{img.label}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
