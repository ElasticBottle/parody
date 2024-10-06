import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { projectTable } from "./project";
import { teamRoleTable } from "./team-role";

export const teamTable = sqlitePublicTable("team", {
  id: integer("team_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  projectId: integer("project_id")
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const teamRelations = relations(teamTable, ({ many }) => {
  return {
    teamRoles: many(teamRoleTable),
  };
});
