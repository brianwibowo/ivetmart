"use client";

import dynamic from "next/dynamic";

const Dither = dynamic(() => import("@/components/ui/dither"), {
	ssr: false,
});

export function DitherBackground() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-auto opacity-75">
			<Dither
				waveColor={[0.5, 0.05, 0.08]}
				disableAnimation={false}
				enableMouseInteraction={true}
				mouseRadius={0.3}
				colorNum={4}
				waveAmplitude={0.3}
				waveFrequency={3}
				waveSpeed={0.05}
			/>
		</div>
	);
}
