import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const sessionTable = sqliteTable("session", {
	id: text("session_id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId()),
	browser_name: text("browser_name").notNull(),
	browser_version: text("browser_version").notNull(),
	os_name: text("os_name").notNull(),
	ip_address: text("ip_address").notNull(),
	user_id: text("user_id").references(() => userTable.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	expires_at: integer("expires_at").notNull(),
	created_at: integer("created_at")
		.notNull()
		.$defaultFn(() => new Date().getTime()),
	updated_at: integer("updated_at")
		.notNull()
		.$onUpdateFn(() => new Date().getTime()),
	deleted_at: integer("deleted_at"),
});

export const sessionRelations = relations(sessionTable, ({ one }) => {
	return {
		user: one(userTable),
	};
});
