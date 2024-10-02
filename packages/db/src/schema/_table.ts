import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const sqliteAuthTable = sqliteTableCreator((name) => `public_${name}`);
export const sqliteAppTable = sqliteTableCreator((name) => `app_${name}`);
