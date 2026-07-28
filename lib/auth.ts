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
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session;
});

/**
 * Get session user role.
 * Returns null if not authenticated.
 */
export async function getUserRole() {
	const session = await getSession();
	if (!session) return null;
	return (session.user as Record<string, unknown>).role as "buyer" | "seller" | "admin" | null;
}
