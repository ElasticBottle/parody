import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const fooTable = sqliteTable("user", {
  id:   text("user_id").notNull().$defaultFn(() => randomUUID()),
});