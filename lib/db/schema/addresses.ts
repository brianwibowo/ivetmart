/**
 * Addresses Table — Ivet Mart
 *
 * Buyer shipping addresses. Each user can have multiple addresses
 * with one marked as default.
 */

import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const addresses = pgTable("addresses", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	label: varchar("label", { length: 50 }).notNull(),
	recipientName: varchar("recipient_name", { length: 255 }).notNull(),
	phone: varchar("phone", { length: 20 }).notNull(),
	addressLine: text("address_line").notNull(),
	city: varchar("city", { length: 100 }),
	province: varchar("province", { length: 100 }),
	postalCode: varchar("postal_code", { length: 10 }),
	isDefault: boolean("is_default").default(false),
	createdAt: timestamp("created_at").defaultNow(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
