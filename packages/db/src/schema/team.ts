import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAuthTable } from "./_table";
import { projectTable } from "./project";
import { teamRoleTable } from "./team-role";

export const teamTable = sqliteAuthTable("team", {
  id: text("team_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId()),
  name: text("name").notNull(),
  description: text("description"),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date()),
  deleted_at: integer("deleted_at", { mode: "timestamp" }),
});

export const teamRelations = relations(teamTable, ({ many }) => {
  return {
    teamRoles: many(teamRoleTable),
  };
});
