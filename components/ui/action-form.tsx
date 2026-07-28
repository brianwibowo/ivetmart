/**
 * Action Form Component — Ivet Mart
 *
 * Client-side form wrapper that:
 * 1. Calls a server action via useActionState
 * 2. Automatically shows toast.success() or toast.error() based on action result
 * 3. Renders a SubmitButton with loading spinner
 *
 * Server actions wrapped by this component MUST return:
 *   { success: boolean; message: string }
 */

"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionResult = { success: boolean; message: string };

interface ActionFormProps {
	action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
	children: React.ReactNode;
	className?: string;
	onSuccess?: () => void;
}

const initialState: ActionResult = { success: false, message: "" };

export function ActionForm({ action, children, className, onSuccess }: ActionFormProps) {
	const [state, formAction, isPending] = useActionState(action, initialState);
	const prevMessageRef = useRef("");

	useEffect(() => {
		if (state.message && state.message !== prevMessageRef.current) {
			if (state.success) {
				toast.success(state.message);
				onSuccess?.();
			} else {
				toast.error(state.message);
			}
			prevMessageRef.current = state.message;
		}
	}, [state, onSuccess]);

	return (
		<form action={formAction} className={className}>
			{children}
		</form>
	);
}
