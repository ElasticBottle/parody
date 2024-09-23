import { createClient } from "@libsql/client";
import { logger } from "@parody/logger";
import { drizzle } from "drizzle-orm/libsql";
import * as authAccount from "./schema/auth-account";
import * as authAccountTeamRole from "./schema/auth-account-team-role";
import * as session from "./schema/session";
import * as team from "./schema/team";
import * as teamRole from "./schema/team-role";

import * as user from "./schema/user";

import type { Logger } from "drizzle-orm";

const schema = {
	...authAccountTeamRole,
	...authAccount,
	...session,
	...team,
	...teamRole,
	...user,
};

if (!process.env.TURSO_CONNECTION_URL) {
	throw new Error("TURSO_CONNECTION_URL is not set");
}
if (!process.env.TURSO_AUTH_TOKEN) {
	throw new Error("TURSO_AUTH_TOKEN is not set");
}

const client = createClient({
	url: process.env.TURSO_CONNECTION_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

class MyLogger implements Logger {
	logQuery(query: string, params: Array<unknown>): void {
		logger.info({ query, params });
	}
}

export const db = drizzle(client, {
	schema,
	logger: new MyLogger(),
});
