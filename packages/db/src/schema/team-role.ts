import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { teamTable } from "./team";

export const teamRoleTable = sqlitePublicTable(
  "team_role",
  {
    id: integer("team_role_id").primaryKey({ autoIncrement: true }),
    team_id: integer("team_id")
      .notNull()
      .references(() => teamTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
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
      teamIdIdx: index("team_role_team_id_idx").on(table.team_id),
    };
  },
);

export const teamRoleRelations = relations(teamRoleTable, ({ one }) => {
  return {
    team: one(teamTable),
  };
});
