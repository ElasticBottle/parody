import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const fooTable = sqliteTable("user", {
	id: text("user_id")
		.notNull()
		.$defaultFn(() => randomUUID()),
});
