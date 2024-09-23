import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { teamRoleTable } from "./team-role";

export const teamTable = sqliteTable("team", {
	id: text("team_id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId()),
	name: text("name").notNull(),
	description: text("description"),
	created_at: integer("created_at")
		.notNull()
		.$defaultFn(() => new Date().getTime()),
	updated_at: integer("updated_at")
		.notNull()
		.$onUpdateFn(() => new Date().getTime()),
	deleted_at: integer("deleted_at"),
});

export const teamRelations = relations(teamTable, ({ many }) => {
	return {
		teamRoles: many(teamRoleTable),
	};
});
