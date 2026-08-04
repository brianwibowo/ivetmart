/**
 * Structured Logger — Ivet Mart
 *
 * Lightweight logger that outputs structured JSON to stdout.
 * Captured automatically by `docker logs ivetmart-web`.
 * No external dependencies required.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info("Order created", { orderId, userId });
 *   logger.error("Payment failed", { orderId, error: err.message });
 */

type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function formatLog(level: LogLevel, message: string, context?: LogContext) {
	const entry = {
		timestamp: new Date().toISOString(),
		level,
		message,
		...context,
	};

	const output = JSON.stringify(entry);

	switch (level) {
		case "error":
			console.error(output);
			break;
		case "warn":
			console.warn(output);
			break;
		default:
			console.log(output);
	}
}

export const logger = {
	info(message: string, context?: LogContext) {
		formatLog("info", message, context);
	},
	warn(message: string, context?: LogContext) {
		formatLog("warn", message, context);
	},
	error(message: string, context?: LogContext) {
		formatLog("error", message, context);
	},
};
