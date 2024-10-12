import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { projectTable } from "./project";
import { sessionTable } from "./session";
import { userToAuthAccountTable } from "./user-to-auth-account";

export const userTable = sqlitePublicTable(
  "user",
  {
    id: integer("user_id").primaryKey({ autoIncrement: true }),
    projectId: integer()
      .notNull()
      .references(() => projectTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    username: text(),
    firstName: text(),
    lastName: text(),
    additional_info: text({ mode: "json" }),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => new Date()),
    deletedAt: integer({ mode: "timestamp" }),
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
    userToAuthAccount: many(userToAuthAccountTable),
    sessions: many(sessionTable),
  };
});
