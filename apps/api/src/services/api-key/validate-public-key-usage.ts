import { ParseResult, Schema } from "@effect/schema";
import { Db } from "@parody/db/client";
import { Effect } from "effect";
import { type IPublicKey, PublicKeySchema, encodePublicKey } from "./keys";

export class InvalidPublicKeyUsageError extends Schema.TaggedError<InvalidPublicKeyUsageError>()(
  "InvalidPublicKeyUsageError",
  {
    publicKey: PublicKeySchema,
    message: Schema.optionalWith(Schema.String, {
      default: () => "Invalid public key usage",
    }),
  },
) {}

export const validatePublicKeyUsage = (args: {
  publicKey: IPublicKey;
  redirectUrl?: string;
  url?: string;
  bundleId?: string;
}) =>
  Effect.gen(function* () {
    const { db } = yield* Db;
    const publicKey = yield* encodePublicKey(args.publicKey);
    const apiKeyInfo = yield* db.use({
      spanName: "apiKeyTable",
      fn: async (client) => {
        const result = await client.query.apiKeyTable.findFirst({
          where: (apiKey, { eq, and, isNull, gt }) =>
            and(
              eq(apiKey.publicKey, publicKey),
              isNull(apiKey.deletedAt),
              gt(apiKey.expiresAt, new Date()),
            ),
        });
        return result;
      },
    });
    yield* Effect.log("apiKeyInfo", apiKeyInfo);

    // No valid API key found
    if (!apiKeyInfo) {
      return yield* new InvalidPublicKeyUsageError({
        publicKey: args.publicKey,
      });
    }

    // validate redirect URL if present
    if (
      args.redirectUrl &&
      !apiKeyInfo.allowedRedirectUrls.some((url) => url === args.redirectUrl)
    ) {
      return yield* new InvalidPublicKeyUsageError({
        publicKey: args.publicKey,
        message: `Invalid Redirect URL ${args.redirectUrl} provided`,
      });
    }

    // errors if both url and bundleId are missing
    if (!args.url && !args.bundleId) {
      yield* new InvalidPublicKeyUsageError({
        publicKey: args.publicKey,
      });
    }

    // validate URL if present
    if (args.url) {
      const url = yield* Schema.decodeUnknown(UrlSchema)(args.url);
      if (!apiKeyInfo.allowedDomains.some((domain) => domain === url.origin)) {
        yield* new InvalidPublicKeyUsageError({
          publicKey: args.publicKey,
        });
      }
    }

    // validate bundleId if present
    if (args.bundleId) {
      // TODO: Check if the origin is whitelisted
    }

    // Everything is validated
  }).pipe(Effect.withSpan("apiKeyService.validatePublicKeyUsage"));

class UrlSchema extends Schema.transformOrFail(
  Schema.String,
  Schema.instanceOf(URL),
  {
    decode: (input, _, ast) => {
      try {
        const url = new URL(input);
        return ParseResult.succeed(url);
      } catch (_) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, "Invalid URL"),
        );
      }
    },
    encode: (url) => ParseResult.succeed(url.toString()),
  },
) {}
