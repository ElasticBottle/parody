import { Schema } from "@effect/schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { Config, Effect } from "effect";
import type { ConfigError } from "effect/ConfigError";
import * as apiKey from "./schema/api-key";
import * as authAccount from "./schema/auth-account";
import * as authAccountTeamRole from "./schema/auth-account-team-role";
import * as session from "./schema/session";
import * as team from "./schema/team";
import * as teamRole from "./schema/team-role";
import * as user from "./schema/user";

const schema = {
  ...apiKey,
  ...authAccountTeamRole,
  ...authAccount,
  ...session,
  ...team,
  ...teamRole,
  ...user,
};

export class DbAcquisitionError extends Schema.TaggedError<DbAcquisitionError>()(
  "DbAcquisitionError",
  {
    message: Schema.String,
    rawError: Schema.Unknown,
    stringifiedError: Schema.String,
  },
) {}
export class DbUsageError extends Schema.TaggedError<DbUsageError>()(
  "DbUsageError",
  {
    message: Schema.String,
    rawError: Schema.Unknown,
    stringifiedError: Schema.String,
  },
) {}

export type DbError = DbAcquisitionError | DbUsageError | ConfigError;

const dbConfig = Config.nested(
  Config.all([Config.string("DATABASE_URL"), Config.string("AUTH_TOKEN")]),
  "TURSO",
);

const acquireDb = Effect.gen(function* () {
  const [url, authToken] = yield* dbConfig;

  const client = yield* Effect.try({
    try: () =>
      createClient({
        url,
        authToken,
      }),
    catch: (e) =>
      new DbAcquisitionError({
        message: `Database SQLite client creation error: ${e}`,
        rawError: e,
        stringifiedError: JSON.stringify(e),
      }),
  });

  const drizzleClient = yield* Effect.try({
    try: () =>
      drizzle(client, {
        schema,
      }),
    catch: (e) =>
      new DbAcquisitionError({
        message: `Drizzle client creation error: ${e}`,
        rawError: e,
        stringifiedError: JSON.stringify(e),
      }),
  });
  const db = {
    use: <A>({
      fn,
      spanName,
    }: {
      spanName: string;
      fn: (arg: typeof drizzleClient) => Promise<A>;
    }) => {
      return Effect.tryPromise({
        try: () => fn(drizzleClient),
        catch: (e) => {
          console.error(e);
          return new DbUsageError({
            message: `Database encountered an error: ${e}`,
            rawError: e,
            stringifiedError: JSON.stringify(e),
          });
        },
      }).pipe(Effect.withSpan(`Db.${spanName}`));
    },
  };
  return { db, client };
}).pipe(Effect.withSpan("Db.acquireDb"));

export const Db = Effect.acquireRelease(acquireDb, ({ client }) =>
  Effect.sync(() => client.close()).pipe(Effect.withSpan("Db.releaseDb")),
);
