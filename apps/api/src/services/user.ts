import type { DiscordUser, GitHubUser } from "@cubeflair/oauth/provider";
import { Db, type DbError } from "@parody/db/client";
import {
  type SelectAuthAccount,
  authAccountTable,
} from "@parody/db/schema/auth-account";
import { userTable } from "@parody/db/schema/user";
import { Effect, Layer } from "effect";
import type { Scope } from "effect/Scope";

export class UserService extends Effect.Tag("@cubeflair/user-service")<
  UserService,
  {
    upsertAuthAccount: (
      args: { projectId: number } & (
        | {
            type: "discord";
            user: DiscordUser;
          }
        | {
            type: "github";
            user: GitHubUser;
          }
      ),
    ) => Effect.Effect<SelectAuthAccount, DbError, Scope>;
  }
>() {
  static liveLayer = Layer.succeed(this, {
    upsertAuthAccount: (args) =>
      Effect.gen(function* () {
        const { db } = yield* Db;
        const existingAuthAccount = yield* db.use({
          fn: async (client) => {
            return await client.query.authAccountTable.findFirst({
              where: (authAccount, { eq, and }) =>
                and(
                  eq(authAccount.authProviderId, args.user.id),
                  eq(authAccount.authProviderMethod, args.type),
                  eq(authAccount.projectId, args.projectId),
                ),
            });
          },
          spanName: "existingAuthAccount",
        });

        if (existingAuthAccount) {
          return existingAuthAccount;
        }

        const newAuthAccount = yield* db.use({
          fn: async (client) => {
            return await client.transaction(async (tx) => {
              const users = await tx
                .insert(userTable)
                .values({
                  projectId: args.projectId,
                })
                .returning({ id: userTable.id });
              if (users.length !== 1) {
                throw new Error(
                  `BAD STATE: Failed to insert user. Got ${users.length} users with IDs: ${users.map((u) => u.id).join(", ")}`,
                );
              }
              const user = users[0];
              if (!user) {
                throw new Error("BAD STATE: User is not defined");
              }

              const authAccounts = await tx
                .insert(authAccountTable)
                .values({
                  type: "regular",
                  userId: user.id,
                  projectId: 1,
                  authProviderId: args.user.id,
                  authProviderInfo: args.user,
                  authProviderMethod: args.type,
                })
                .returning();

              if (authAccounts.length !== 1) {
                throw new Error(
                  `BAD STATE: Failed to insert auth account. Got ${authAccounts.length} auth accounts with IDs: ${authAccounts.map((u) => u.id).join(", ")}`,
                );
              }
              const authAccount = authAccounts[0];
              if (!authAccount) {
                throw new Error("BAD STATE: Auth account is not defined");
              }

              return { ...authAccount };
            });
          },
          spanName: "insertUserAndAuthAccount",
        });

        return newAuthAccount;
      }),
  });
}
