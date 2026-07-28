/**
 * Auth API Route — Ivet Mart
 *
 * Handles all /api/auth/* requests via local better-auth instance.
 * Replaces the previous proxy-to-apex approach.
 */

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth-server";

export const { GET, POST } = toNextJsHandler(auth);
