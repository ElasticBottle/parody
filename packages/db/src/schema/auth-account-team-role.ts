import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAuthTable } from "./_table";
import { authAccountTable } from "./auth-account";
import { teamRoleTable } from "./team-role";

export const authAccountTeamRoleTable = sqliteAuthTable(
	"auth_account_team_role",
	{
		id: text("account_team_role_id")
			.primaryKey()
			.notNull()
			.$defaultFn(() => generateId()),
		auth_account_id: text("account_id")
			.notNull()
			.references(() => authAccountTable.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		team_role_id: text("team_role_id")
			.notNull()
			.references(() => teamRoleTable.id, {
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
	},
);

export const authAccountTeamRoleRelations = relations(
	authAccountTeamRoleTable,
	({ one }) => {
		return {
			authAccount: one(authAccountTable),
			teamRole: one(teamRoleTable),
		};
	},
);
