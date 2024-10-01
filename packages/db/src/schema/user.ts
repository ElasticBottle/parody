import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAuthTable } from "./_table";
import { authAccountTable } from "./auth-account";
import { projectTable } from "./project";
import { sessionTable } from "./session";

export const userTable = sqliteAuthTable("user", {
  id: text("user_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId()),
  projectId: text("project_id").references(() => projectTable.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  additional_info: text("additional_info", { mode: "json" }).$type<
    Record<string, string | number | boolean>
  >(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date()),
  deleted_at: integer("deleted_at", { mode: "timestamp" }),
});

export const userRelations = relations(userTable, ({ many }) => {
  return {
    authAccounts: many(authAccountTable),
    sessions: many(sessionTable),
  };
});
