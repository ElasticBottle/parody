import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { authAccountTeamRoleTable } from "./auth-account-team-role";
import { teamTable } from "./team";
import { userTable } from "./user";

export type AuthAccountType = "regular" | "primary" | "2fa";
export type AuthProviderMethodType =
	| "google"
	| "facebook"
	| "discord"
	| "github";

export const authAccountTable = sqliteTable(
	"auth_account",
	{
		id: text("account_id")
			.primaryKey()
			.notNull()
			.$defaultFn(() => generateId()),
		user_id: text("user_id").references(() => userTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
		authProviderId: text("auth_provider_id").notNull(),
		authProviderMethod: text("auth_provider_method")
			.notNull()
			.$type<AuthProviderMethodType>(),
		auth_provider_info: text("auth_provider_info").notNull(),
		type: text("type").notNull().$type<AuthAccountType>(),
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
			authProviderMethodIdx: index("auth_account_auth_provider_method_idx").on(
				table.authProviderMethod,
			),
			authProviderIdIdx: index("auth_account_auth_provider_id_idx").on(
				table.authProviderId,
			),
		};
	},
);

export const authAccountRelations = relations(
	authAccountTable,
	({ many, one }) => {
		return {
			user: one(userTable, {
				fields: [authAccountTable.user_id],
				references: [userTable.id],
			}),
			teams: many(teamTable),
			teamRoles: many(authAccountTeamRoleTable),
		};
	},
);
