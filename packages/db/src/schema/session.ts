import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { userTable } from "./user";

export type SelectSession = typeof sessionTable.$inferSelect;

export const sessionTable = sqlitePublicTable("session", {
  id: integer("session_id").primaryKey({
    autoIncrement: true,
  }),
  session_token_hash: text(),
  browser_name: text(),
  browser_version: text(),
  os_name: text(),
  ip_address: text().notNull(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  expires_at: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp" }),
});

export const sessionRelations = relations(sessionTable, ({ one }) => {
  return {
    user: one(userTable),
  };
});
