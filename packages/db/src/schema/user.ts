import { generateId } from "@parody/core/random/generate-id";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { authAccountTable } from "./auth-account";
import { sessionTable } from "./session";

export const userTable = sqliteTable("user", {
	id: text("user_id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId()),
	additional_info: text("additional_info"),
	created_at: integer("created_at")
		.notNull()
		.$defaultFn(() => new Date().getTime()),
	updated_at: integer("updated_at")
		.notNull()
		.$onUpdateFn(() => new Date().getTime()),
	deleted_at: integer("deleted_at"),
});

export const userRelations = relations(userTable, ({ many }) => {
	return {
		authAccounts: many(authAccountTable),
		sessions: many(sessionTable),
	};
});
