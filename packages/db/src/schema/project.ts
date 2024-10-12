import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { authAccountTable } from "./auth-account";
import { teamTable } from "./team";
import { userTable } from "./user";

export const projectTable = sqlitePublicTable(
  "project",
  {
    id: integer("project_id").primaryKey({ autoIncrement: true }),
    teamId: integer()
      .notNull()
      .references(() => teamTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: text().notNull(),
    description: text(),
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
      teamIdIdx: index("project_team_id_idx").on(table.teamId),
    };
  },
);

export const projectRelations = relations(projectTable, ({ one, many }) => {
  return {
    team: one(teamTable, {
      fields: [projectTable.teamId],
      references: [teamTable.id],
    }),
    users: many(userTable),
    authAccounts: many(authAccountTable),
  };
});
