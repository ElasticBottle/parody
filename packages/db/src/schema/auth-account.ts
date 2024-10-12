import type { DiscordUser, GitHubUser } from "@cubeflair/auth/provider";
import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { authAccountTeamRoleTable } from "./auth-account-team-role";
import { teamTable } from "./team";
import { userToAuthAccountTable } from "./user-to-auth-account";

export type SelectAuthAccount = typeof authAccountTable.$inferSelect;
export const AUTH_ACCOUNT_TYPE = ["regular", "2fa"] as const;

export const authAccountTable = sqlitePublicTable(
  "auth_account",
  {
    id: integer("account_id").primaryKey({ autoIncrement: true }),
    authProviderId: text().notNull(),
    authProviderInfo: text({ mode: "json" })
      .$type<DiscordUser | GitHubUser>()
      .notNull(),
    type: text({ enum: AUTH_ACCOUNT_TYPE }).notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => new Date()),
    deletedAt: integer({ mode: "timestamp" }),
  },
  (table) => {
    return {
      authProviderIdIdx: index("auth_account_auth_provider_id_idx").on(
        table.authProviderId,
      ),
    };
  },
);

export const authAccountRelations = relations(authAccountTable, ({ many }) => {
  return {
    teams: many(teamTable),
    authAccountTeamRole: many(authAccountTeamRoleTable),
    userToAuthAccount: many(userToAuthAccountTable),
  };
});
