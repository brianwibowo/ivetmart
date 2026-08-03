/**
 * Database Enums — Ivet Mart
 *
 * Shared PostgreSQL enum definitions used across multiple tables.
 */

import { pgEnum } from "drizzle-orm/pg-core";

/** Status toko penjual */
export const storeStatusEnum = pgEnum("store_status", ["pending", "active", "suspended", "rejected"]);

/** Status pesanan (lifecycle) */
export const orderStatusEnum = pgEnum("order_status", [
	"pending_payment",
	"paid",
	"processing",
	"shipped",
	"delivered",
	"completed",
	"cancelled",
	"refunded",
]);
