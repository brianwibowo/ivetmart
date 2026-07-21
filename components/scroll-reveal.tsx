"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollReveal({
	children,
	className = "",
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-out ${
				isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
			} ${className}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
}
