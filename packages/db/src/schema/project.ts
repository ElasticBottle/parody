import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAppTable } from "./_table";
import { authAccountTable } from "./auth-account";
import { teamTable } from "./team";
import { userTable } from "./user";

export const projectTable = sqliteAppTable(
  "project",
  {
    id: integer("project_id").primaryKey({ autoIncrement: true }),
    teamId: integer("team_id"),
    name: text("name").notNull(),
    description: text("description"),
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
