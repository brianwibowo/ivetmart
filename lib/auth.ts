/**
 * Server-Side Session Helpers — Ivet Mart
 *
 * Use these functions in Server Components, Server Actions,
 * and Route Handlers to get the current user session.
 */

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth-server";

/**
 * Get the current user session (cached per request).
 * Returns null if not authenticated.
 *
 * @example
 * ```tsx
 * const session = await getSession();
 * if (session) {
 *   console.log(session.user.name, session.user.role);
 * }
 * ```
 */
export const getSession = cache(async () => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		return session;
	} catch {
		return null;
	}
});

/**
 * Get session user role.
 * Returns null if not authenticated.
 */
export async function getUserRole() {
	const session = await getSession();
	if (!session) return null;
	const role = (session.user as { role?: string }).role;
	return (role || "buyer") as "buyer" | "seller" | "admin";
}
