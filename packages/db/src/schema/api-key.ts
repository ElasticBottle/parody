import { generateId } from "@parody/core/random/generate-id";
import { integer, text } from "drizzle-orm/sqlite-core";
import { sqliteAppTable } from "./_table";
import { projectTable } from "./project";

export const apiKeyTable = sqliteAppTable("api_key", {
	id: text("api_key_id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId()),
	projectId: text("project_id").references(() => projectTable.id, {
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
	publicKey: text("public_key").notNull(),
	privateKey: text("private_key").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$onUpdateFn(() => new Date()),
	deleted_at: integer("deleted_at", { mode: "timestamp" }),
});
