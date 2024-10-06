import type { DiscordUser, GitHubUser } from "@cubeflair/oauth/provider";
import { SUPPORTED_OAUTH_PROVIDERS } from "@cubeflair/oauth/supported-oauth";
import { relations } from "drizzle-orm";
import { index, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { authAccountTeamRoleTable } from "./auth-account-team-role";
import { projectTable } from "./project";
import { teamTable } from "./team";
import { userTable } from "./user";

export const AUTH_ACCOUNT_TYPE = ["regular", "2fa"] as const;

export const authAccountTable = sqlitePublicTable(
  "auth_account",
  {
    id: integer("account_id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projectTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    authProviderId: text("auth_provider_id").notNull(),
    authProviderMethod: text("auth_provider_method", {
      enum: SUPPORTED_OAUTH_PROVIDERS,
    }).notNull(),
    authProviderInfo: text("auth_provider_info", { mode: "json" })
      .$type<DiscordUser | GitHubUser>()
      .notNull(),
    type: text("type", { enum: AUTH_ACCOUNT_TYPE }).notNull(),
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
      projectIdIdx: index("auth_account_project_id_idx").on(table.projectId),
      authProviderMethodIdx: index("auth_account_auth_provider_method_idx").on(
        table.authProviderMethod,
      ),
      authProviderIdIdx: index("auth_account_auth_provider_id_idx").on(
        table.authProviderId,
      ),
      projectIdAuthProviderIdIdx: uniqueIndex(
        "auth_account_project_id_auth_provider_unique_idx",
      ).on(table.projectId, table.authProviderId),
    };
  },
);

export const authAccountRelations = relations(
  authAccountTable,
  ({ many, one }) => {
    return {
      user: one(userTable, {
        fields: [authAccountTable.userId],
        references: [userTable.id],
      }),
      project: one(projectTable, {
        fields: [authAccountTable.projectId],
        references: [projectTable.id],
      }),
      teams: many(teamTable),
      teamRoles: many(authAccountTeamRoleTable),
    };
  },
);
