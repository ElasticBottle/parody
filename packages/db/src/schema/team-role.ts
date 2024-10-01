import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAuthTable } from "./_table";
import { teamTable } from "./team";

export const teamRoleTable = sqliteAuthTable(
  "team_role",
  {
    id: text("team_role_id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    team_id: text("team_id")
      .notNull()
      .references(() => teamTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: text("name").notNull(),
    description: text("description"),
    created_at: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updated_at: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => new Date()),
    deleted_at: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => {
    return {
      teamIdIdx: index("team_role_team_id_idx").on(table.team_id),
    };
  },
);

export const teamRoleRelations = relations(teamRoleTable, ({ one }) => {
  return {
    team: one(teamTable),
  };
});
