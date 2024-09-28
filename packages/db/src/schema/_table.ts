import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const sqliteAuthTable = sqliteTableCreator((name) => `shared_${name}`);
export const sqliteAppTable = sqliteTableCreator((name) => `ii_${name}`);
