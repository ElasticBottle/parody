import { integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sqlitePublicTable } from "./_table";
import { authAccountTable } from "./auth-account";
import { projectTable } from "./project";
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
    projectId: integer().references(() => projectTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    authAccountId: integer()
      .notNull()
      .references(() => authAccountTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: integer()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: text().notNull(),
    description: text(),
    allowedDomains: text({ mode: "json" }).notNull().$type<Array<string>>(),
    allowedBundleIdentifiers: text({
      mode: "json",
    })
      .notNull()
      .$type<Array<string>>(),
    allowedRedirectUrls: text({ mode: "json" })
      .notNull()
      .$type<Array<string>>(),
    metadata: text({ mode: "json" }),
    publicKey: text().unique().notNull().$type<`public_key_${string}`>(),
    hashedPrivateKey: text().unique().notNull(),
    expiresAt: integer({ mode: "timestamp" }).notNull(),
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
      hashedPrivateKeyIdx: uniqueIndex("api_key_hashed_private_key_idx").on(
        table.hashedPrivateKey,
      ),
      publicKeyIdx: uniqueIndex("api_key_public_key_idx").on(table.publicKey),
    };
  },
);
