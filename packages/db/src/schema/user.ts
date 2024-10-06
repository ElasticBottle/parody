import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { authAccountTable } from "./auth-account";
import { projectTable } from "./project";
import { sessionTable } from "./session";

export const userTable = sqlitePublicTable(
  "user",
  {
    id: integer("user_id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projectTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    username: text("username"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    additional_info: text("additional_info", { mode: "json" }).$type<
      Record<string, string | number | boolean>
    >(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => {
    return {
      projectIdIdx: index("user_project_id_idx").on(table.projectId),
    };
  },
);

export const userRelations = relations(userTable, ({ many, one }) => {
  return {
    project: one(projectTable, {
      fields: [userTable.projectId],
      references: [projectTable.id],
    }),
    authAccounts: many(authAccountTable),
    sessions: many(sessionTable),
  };
});
