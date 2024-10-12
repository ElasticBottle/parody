import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { projectTable } from "./project";
import { teamRoleTable } from "./team-role";

export const teamTable = sqlitePublicTable("team", {
  id: integer("team_id").primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp" }),
});

export const teamRelations = relations(teamTable, ({ many }) => {
  return {
    teamRoles: many(teamRoleTable),
    projects: many(projectTable),
  };
});
