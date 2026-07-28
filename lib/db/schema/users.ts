/**
 * Users Table — Ivet Mart
 *
 * Core user table for buyers, sellers, and admins.
 * Auth is handled by better-auth; this table extends it with role & status.
 */

import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userRoleEnum, userStatusEnum } from "./enums";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: varchar("email", { length: 255 }).unique().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	passwordHash: text("password_hash").notNull(),
	phone: varchar("phone", { length: 20 }),
	avatarUrl: text("avatar_url"),
	role: userRoleEnum("role").notNull().default("buyer"),
	status: userStatusEnum("status").notNull().default("active"),
	emailVerifiedAt: timestamp("email_verified_at"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

/** TypeScript type inferred from the users table schema */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
