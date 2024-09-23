import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { teamTable } from "./team";

export const teamRoleTable = sqliteTable(
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
		created_at: integer("created_at")
			.notNull()
			.$defaultFn(() => new Date().getTime()),
		updated_at: integer("updated_at")
			.notNull()
			.$onUpdateFn(() => new Date().getTime()),
		deleted_at: integer("deleted_at"),
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
