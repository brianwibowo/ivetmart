/**
 * Proxy — Ivet Mart (Next.js 16 convention, replaces middleware.ts)
 *
 * Handles:
 * 1. Route protection — redirect unauthenticated users from protected routes
 * 2. Auth page redirect — redirect logged-in users away from login/signup
 *
 * Role-based access is enforced server-side in layouts (via auth-guard.ts).
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Routes that require authentication (any role) */
const PROTECTED_PREFIXES = ["/account", "/seller", "/admin"];

/** Routes that should redirect if already authenticated */
const AUTH_PAGES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const sessionToken = request.cookies.get("better-auth.session_token");
	const isLoggedIn = Boolean(sessionToken);

	// ─── Redirect logged-in users away from auth pages ────
	const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));
	if (isAuthPage && isLoggedIn) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// ─── Redirect unauthenticated users to login ──────────
	const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
	if (isProtected && !isLoggedIn) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/account/:path*", "/seller/:path*", "/admin/:path*", "/login", "/signup"],
};
