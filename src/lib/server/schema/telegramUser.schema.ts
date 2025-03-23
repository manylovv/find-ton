import { bigint, boolean, pgTable, real, varchar } from "drizzle-orm/pg-core";

import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export const usersTable = pgTable("user", {
  firstName: varchar("first_name", { length: 255 }).notNull(),
  id: bigint("id", { mode: "number" }).primaryKey(),
  isPremium: boolean("is_premium").default(false).notNull(),
  languageCode: varchar("language_code", { length: 255 }).default("en").notNull(),
  lastName: varchar("last_name", { length: 255 }),
  photoUrl: varchar("photo_url", { length: 255 }),
  username: varchar("username", { length: 255 }),
  balance: real("balance").default(0).notNull(),
});

export type User = InferSelectModel<typeof usersTable>;
export type NewUser = InferInsertModel<typeof usersTable>;
