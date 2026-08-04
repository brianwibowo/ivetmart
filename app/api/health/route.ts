/**
 * Health Check Endpoint — Ivet Mart
 *
 * GET /api/health
 *
 * Returns 200 if database is reachable, 503 otherwise.
 * Used by Docker health check and external monitoring (UptimeRobot, etc).
 */

import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
	const start = Date.now();

	try {
		await db.execute(sql`SELECT 1`);
		const dbLatency = Date.now() - start;

		return NextResponse.json(
			{
				status: "healthy",
				timestamp: new Date().toISOString(),
				database: "connected",
				dbLatencyMs: dbLatency,
				version: process.env.npm_package_version || "0.1.0",
			},
			{ status: 200 },
		);
	} catch {
		return NextResponse.json(
			{
				status: "unhealthy",
				timestamp: new Date().toISOString(),
				database: "disconnected",
			},
			{ status: 503 },
		);
	}
}
