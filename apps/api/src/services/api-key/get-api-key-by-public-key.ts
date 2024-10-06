import { Db, DbUsageError } from "@parody/db/client";
import type { SelectApiKeyWithProjectId } from "@parody/db/schema/api-key";
import { Effect } from "effect";
import { type IPublicKey, encodePublicKey } from "./keys";

export const getApiKeyByPublicKey = (publicKey: IPublicKey) =>
  Effect.gen(function* () {
    const { db } = yield* Db;
    const encodedPublicKey = yield* encodePublicKey(publicKey);
    const apiKeyInfo = yield* db.use({
      spanName: "getApiKeyByPublicKey",
      fn: async (client) => {
        return await client.query.apiKeyTable.findFirst({
          where: (apiKey, { eq, and, isNull, gt }) =>
            and(
              eq(apiKey.publicKey, encodedPublicKey),
              isNull(apiKey.deletedAt),
              gt(apiKey.expiresAt, new Date()),
            ),
        });
      },
    });

    return apiKeyInfo;
  });

export const getApiKeyByPublicKeyWithProjectId = (publicKey: IPublicKey) => {
  return Effect.gen(function* () {
    const apiKey = yield* getApiKeyByPublicKey(publicKey);
    yield* Effect.log("apiKey", apiKey);

    if (typeof apiKey?.metadata?.projectId !== "number") {
      yield* new DbUsageError({
        message: `API key with public key ${publicKey} does not have a project ID`,
        rawError: "",
        stringifiedError: "",
      });
    }

    return apiKey as SelectApiKeyWithProjectId;
  });
};
