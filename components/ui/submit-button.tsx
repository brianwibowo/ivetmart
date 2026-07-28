/**
 * Submit Button Component — Ivet Mart
 *
 * Client-side button that automatically shows a loading spinner (Loader2)
 * during form submission via `useFormStatus`.
 */

"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SubmitButtonProps = React.ComponentProps<typeof Button> & {
	loadingText?: string;
	children: React.ReactNode;
};

export function SubmitButton({
	loadingText = "Memproses...",
	children,
	disabled,
	className,
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			disabled={pending || disabled}
			className={className}
			{...props}
		>
			{pending ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
					<span>{loadingText}</span>
				</>
			) : (
				children
			)}
		</Button>
	);
}
