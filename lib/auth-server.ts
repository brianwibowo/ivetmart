/**
 * better-auth Server Configuration — Ivet Mart
 *
 * Handles authentication, session management, and role-based access.
 * Uses the `admin` plugin for user role management.
 *
 * This module is SERVER-ONLY — never import in client components.
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/lib/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),

	emailAndPassword: {
		enabled: true,
		minPasswordLength: 6,
	},

	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // update session every 24h
	},

	plugins: [
		admin({
			defaultRole: "buyer",
		}),
	],

	user: {
		additionalFields: {
			phone: {
				type: "string",
				required: false,
			},
			role: {
				type: "string",
				defaultValue: "buyer",
				input: true,
			},
		},
	},
});

/**
 * Type exports for use across the app.
 * Use `Session` type for server-side session checking.
 */
export type Session = typeof auth.$Infer.Session;
