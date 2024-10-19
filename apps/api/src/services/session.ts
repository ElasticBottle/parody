import {
  Db,
  type DbAcquisitionError,
  type DbUsageError,
} from "@rectangular-labs/db/client";
import {
  type SelectSession,
  sessionTable,
} from "@rectangular-labs/db/schema/session";
import { Effect, Layer } from "effect";
import type { ConfigError } from "effect/ConfigError";
import type { Scope } from "effect/Scope";
import UAParser from "ua-parser-js";

export class SessionService extends Effect.Tag("@cubeflair/session-service")<
  SessionService,
  {
    createSession: (
      userId: number,
      userAgent?: string,
    ) => Effect.Effect<
      SelectSession,
      ConfigError | DbAcquisitionError | DbUsageError,
      Scope
    >;
    getSession: (sessionId: string) => Effect.Effect<string | null, never>;
  }
>() {
  static layer = Layer.succeed(this, {
    createSession: (userId, userAgent) =>
      Effect.gen(function* () {
        const parser = yield* Effect.sync(() => new UAParser(userAgent ?? ""));
        console.log("parser", parser);
        const parserResults = yield* Effect.sync(() => parser.getResult());
        console.log("parserResults", parserResults);

        // const random = yield* Random;

        const { db } = yield* Db;
        const session = yield* db.use({
          fn: async (client) => {
            const sessions = await client
              .insert(sessionTable)
              .values({
                os_name: parserResults.os.name ?? null,
                browser_name: parserResults.browser.name ?? null,
                browser_version: parserResults.browser.version ?? null,
                expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
                ip_address: "",
                session_token_hash: "",
                userId,
              })
              .returning();
            const session = sessions[0];
            if (sessions.length !== 1 || !session) {
              throw new Error(
                `BAD STATE: Failed to insert session. Got ${sessions.length} sessions with IDs: ${sessions.map((s) => s.id).join(", ")}`,
              );
            }
            return session;
          },
          spanName: "createSession",
        });

        return session;
      }),
    getSession: (sessionId: string) => Effect.succeed("sessionId"),
  });
}
