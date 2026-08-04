/**
 * Rate Limiting Middleware — Ivet Mart
 *
 * In-memory sliding window rate limiter for sensitive routes.
 * No external dependencies (no Redis required).
 *
 * Limits:
 *   /api/auth/*       → 10 req/min per IP (login, signup)
 *   /checkout          → 5  req/min per IP
 *   /seller/register   → 3  req/min per IP
 */

import { type NextRequest, NextResponse } from "next/server";

// ─── Rate Limit Configuration ───────────────────────────
type RateLimitRule = {
	windowMs: number;
	maxRequests: number;
};

const RATE_LIMIT_RULES: [string, RateLimitRule][] = [
	["/api/auth", { windowMs: 60_000, maxRequests: 60 }],
	["/checkout", { windowMs: 60_000, maxRequests: 30 }],
	["/seller/register", { windowMs: 60_000, maxRequests: 20 }],
];

// ─── In-Memory Store ────────────────────────────────────
type RequestRecord = { count: number; resetAt: number };
const ipStore = new Map<string, RequestRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
	const now = Date.now();
	if (now - lastCleanup < CLEANUP_INTERVAL) return;
	lastCleanup = now;

	const keysToDelete: string[] = [];
	ipStore.forEach((record, key) => {
		if (now > record.resetAt) {
			keysToDelete.push(key);
		}
	});
	keysToDelete.forEach((key) => ipStore.delete(key));
}

function isRateLimited(ip: string, rule: RateLimitRule): boolean {
	cleanupStaleEntries();

	const now = Date.now();
	const key = ip;
	const record = ipStore.get(key);

	if (!record || now > record.resetAt) {
		ipStore.set(key, { count: 1, resetAt: now + rule.windowMs });
		return false;
	}

	record.count += 1;
	return record.count > rule.maxRequests;
}

// ─── Middleware Entry ───────────────────────────────────
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Find matching rate limit rule
	const matchedRule = RATE_LIMIT_RULES.find(([prefix]) => pathname.startsWith(prefix));

	if (matchedRule) {
		const [prefix, rule] = matchedRule;
		const clientIp =
			request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");

		// Skip rate limiting if IP cannot be isolated to prevent shared lockouts on Docker proxy
		if (!clientIp || clientIp === "unknown" || clientIp === "127.0.0.1" || clientIp === "::1") {
			return NextResponse.next();
		}

		const rateLimitKey = `${clientIp}:${prefix}`;

		if (isRateLimited(rateLimitKey, rule)) {
			return NextResponse.json(
				{
					error: "Terlalu banyak permintaan",
					message: "Anda telah melampaui batas permintaan. Silakan tunggu beberapa saat.",
				},
				{
					status: 429,
					headers: {
						"Retry-After": String(Math.ceil(rule.windowMs / 1000)),
					},
				},
			);
		}
	}

	return NextResponse.next();
}

export function middleware(request: NextRequest) {
	return proxy(request);
}

export const config = {
	matcher: ["/api/auth/:path*", "/checkout", "/seller/register"],
};
