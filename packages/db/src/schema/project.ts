import { generateId } from "@parody/core/random/generate-id";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAppTable } from "./_table";

export const projectTable = sqliteAppTable("project", {
	id: text("project_id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId()),
	teamId: text("team_id"),
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
