import { relations } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAuthTable } from "./_table";
import { authAccountTeamRoleTable } from "./auth-account-team-role";
import { teamTable } from "./team";
import { userTable } from "./user";

export const AUTH_ACCOUNT_TYPE = ["regular", "primary", "2fa"] as const;
export const AUTH_PROVIDER_METHOD = [
  "google",
  "facebook",
  "discord",
  "github",
] as const;

export const authAccountTable = sqliteAuthTable(
  "auth_account",
  {
    id: integer("account_id").primaryKey({ autoIncrement: true }),
    user_id: integer("user_id").references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    authProviderId: text("auth_provider_id").notNull(),
    authProviderMethod: text("auth_provider_method", {
      enum: AUTH_PROVIDER_METHOD,
    }).notNull(),
    auth_provider_info: text("auth_provider_info", { mode: "json" })
      .$type<Record<string, string>>()
      .notNull(),
    type: text("type", { enum: AUTH_ACCOUNT_TYPE }).notNull(),
    created_at: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updated_at: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdateFn(() => new Date()),
    deleted_at: integer("deleted_at", { mode: "timestamp" }),
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
