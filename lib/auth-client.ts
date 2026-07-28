/**
 * better-auth Client — Ivet Mart
 *
 * Client-side auth hooks and methods.
 * Uses the `admin` client plugin for role-aware operations.
 */

"use client";

import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [adminClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
