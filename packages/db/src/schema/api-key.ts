import { generateId } from "@parody/core/random/generate-id";
import { integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sqliteAppTable } from "./_table";
import { teamTable } from "./team";
import { userTable } from "./user";

export const apiKeyTable = sqliteAppTable(
  "api_key",
  {
    id: text("api_key_id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    teamId: text("team_id").references(() => teamTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: text("name").notNull(),
    description: text("description"),
    allowlistedDomains: text("allowlisted_domains", { mode: "json" }).$type<
      Array<string>
    >(),
    allowlistBundleIdentifiers: text("allowlist_bundle_identifiers", {
      mode: "json",
    }).$type<Array<string>>(),
    metadata: text("metadata", { mode: "json" }).$type<
      Record<string, string | number | boolean>
    >(),
    publicKey: text("public_key")
      .unique()
      .notNull()
      .$type<`public_key_${string}`>(),
    hashedPrivateKey: text("hashed_private_key").unique().notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
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
      hashedPrivateKeyIdx: uniqueIndex("api_key_hashed_private_key_idx").on(
        table.hashedPrivateKey,
      ),
      publicKeyIdx: uniqueIndex("api_key_public_key_idx").on(table.publicKey),
    };
  },
);
