/**
 * Auth Guard Helpers — Ivet Mart
 *
 * Server-side route protection helpers for use in layouts and pages.
 * These redirect unauthorized users before any rendering occurs.
 *
 * @example
 * ```tsx
 * // In app/admin/layout.tsx
 * export default async function AdminLayout({ children }) {
 *   await requireAdmin();
 *   return <>{children}</>;
 * }
 * ```
 */

import { redirect } from "next/navigation";
import { getSession, getUserRole } from "@/lib/auth";

type UserRole = "buyer" | "seller" | "admin";

/**
 * Require any authenticated user.
 * Redirects to /login if not logged in.
 */
export async function requireAuth() {
	const session = await getSession();
	if (!session) {
		redirect("/login");
	}
	return session;
}

/**
 * Require a specific role.
 * Redirects to / if the user's role doesn't match.
 */
export async function requireRole(role: UserRole) {
	const session = await requireAuth();
	const userRole = await getUserRole();

	if (userRole !== role) {
		redirect("/");
	}

	return session;
}

/** Require seller role */
export async function requireSeller() {
	return requireRole("seller");
}

/** Require admin role */
export async function requireAdmin() {
	return requireRole("admin");
}

/** Require buyer role */
export async function requireBuyer() {
	return requireRole("buyer");
}
