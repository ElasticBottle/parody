import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAppTable } from "./_table";

export const projectTable = sqliteAppTable("project", {
  id: integer("project_id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id"),
  name: text("name").notNull(),
  description: text("description"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$onUpdateFn(() => new Date()),
  deleted_at: integer("deleted_at", { mode: "timestamp" }),
});
