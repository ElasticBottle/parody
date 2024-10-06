import { integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { authAccountTable } from "./auth-account";
import { teamTable } from "./team";
import { userTable } from "./user";

export type SelectApiKey = typeof apiKeyTable.$inferSelect;
export type SelectApiKeyWithProjectId = typeof apiKeyTable.$inferSelect & {
  metadata: { projectId: number };
};

export const apiKeyTable = sqlitePublicTable(
  "api_key",
  {
    id: integer("api_key_id").primaryKey({
      autoIncrement: true,
    }),
    teamId: integer("team_id").references(() => teamTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    authAccountId: integer("auth_account_id")
      .notNull()
      .references(() => authAccountTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: text("name").notNull(),
    description: text("description"),
    allowedDomains: text("allowed_domains", { mode: "json" })
      .notNull()
      .$type<Array<string>>(),
    allowedBundleIdentifiers: text("allowed_bundle_identifiers", {
      mode: "json",
    })
      .notNull()
      .$type<Array<string>>(),
    allowedRedirectUrls: text("allowed_redirect_urls", { mode: "json" })
      .notNull()
      .$type<Array<string>>(),
    metadata: text("metadata", { mode: "json" }).$type<
      Record<string, string | number | boolean> | { projectId: number }
    >(),
    publicKey: text("public_key")
      .unique()
      .notNull()
      .$type<`public_key_${string}`>(),
    hashedPrivateKey: text("hashed_private_key").unique().notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
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
      hashedPrivateKeyIdx: uniqueIndex("api_key_hashed_private_key_idx").on(
        table.hashedPrivateKey,
      ),
      publicKeyIdx: uniqueIndex("api_key_public_key_idx").on(table.publicKey),
      privateKeyIdx: uniqueIndex("api_key_public_key_idx").on(table.publicKey),
    };
  },
);
