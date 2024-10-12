import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { authAccountTeamRoleTable } from "./auth-account-team-role";
import { teamTable } from "./team";

export const teamRoleTable = sqlitePublicTable(
  "team_role",
  {
    id: integer("team_role_id").primaryKey({ autoIncrement: true }),
    team_id: integer()
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
      teamIdIdx: index("team_role_team_id_idx").on(table.team_id),
    };
  },
);

export const teamRoleRelations = relations(teamRoleTable, ({ one, many }) => {
  return {
    authAccountTeamRole: many(authAccountTeamRoleTable),
    team: one(teamTable),
  };
});
