import { InvalidState, LoginTimeout } from "@cubeflair/oauth/errors";
import { Oauth } from "@cubeflair/oauth/oauth";
import { Discord } from "@cubeflair/oauth/provider";
import { FetchHttpClient } from "@effect/platform";
import type { Schema } from "@effect/schema";
import { effectValidator } from "@hono/effect-validator";
import { ConfigProvider, Effect, Layer, Option, pipe } from "effect";
import { Hono } from "hono";
import {
  DiscordOauthCallbackSchema,
  OauthInputSchema,
  OauthStateSchema,
} from "~/lib/auth/schema";
import { type ApiKey, ApiKeyService } from "~/services/api-key";
import { CloudflareKvStore } from "~/services/kv-store";
import { UserService } from "~/services/user";
import type { Env } from "../../lib/env";

export const discordRouter = new Hono<{
  Bindings: Env;
}>();

discordRouter
  .get("/", effectValidator("query", OauthInputSchema), async (c) => {
    const getAuthorizationUrl = (
      redirectUrl: string,
      incomingReqUrl: string,
      publicKey: ApiKey.IPublicKey,
    ) => {
      return Effect.gen(function* () {
        yield* Effect.log("incomingReqUrl", incomingReqUrl);

        // TODO: put this in a middleware
        const apiKeyService = yield* ApiKeyService;
        yield* apiKeyService.validatePublicKeyUsage({
          publicKey,
          redirectUrl: redirectUrl.endsWith("/")
            ? redirectUrl.slice(0, -1)
            : redirectUrl,
          url: incomingReqUrl,
          // TODO: pass the bundle ID here
        });
        const url = yield* Oauth.createNonce.pipe(
          Effect.tap(({ codeVerifier, state }) =>
            Effect.gen(function* () {
              const kvStore = (yield* CloudflareKvStore).forSchema(
                OauthStateSchema,
              );
              yield* kvStore.setTtl(
                `discord-${state}`,
                {
                  publicKey,
                  redirectUrl,
                  state,
                  codeVerifier,
                },
                15 * 60, // 15 minutes
              );
            }),
          ),
          Effect.flatMap((args) =>
            Effect.gen(function* () {
              const discordService = yield* Discord.Service;
              return yield* discordService.createAuthorizationUrl(args);
            }),
          ),
        );
        return url;
      });
    };

    const url = await Effect.runPromise(
      getAuthorizationUrl(
        c.req.valid("query").redirectUrl,
        c.req.header("Origin") ?? c.req.header("Referer") ?? "",
        c.req.valid("query").publicKey,
      ).pipe(
        Effect.scoped,
        Effect.provide(Discord.layer),
        Effect.provide(ApiKeyService.layer),
        Effect.provide(CloudflareKvStore.ttlLayer),
        Effect.provide(Oauth.Random.nodeLayer),
        Effect.provide(
          Layer.setConfigProvider(
            ConfigProvider.fromMap(new Map(Object.entries(c.env)), {
              pathDelim: "_",
            }),
          ),
        ),
      ),
    );

    return c.redirect(url.href);
  })

  .get(
    "/callback",
    effectValidator("query", DiscordOauthCallbackSchema),
    async (c) => {
      const handleRedirect = (
        result: Schema.Schema.Type<typeof DiscordOauthCallbackSchema>,
      ) =>
        Effect.gen(function* () {
          if (result.status === "error") {
            return yield* Effect.fail({
              ...result,
              _tag: "oauth_failure" as const,
            });
          }

          const kvStore = (yield* CloudflareKvStore).forSchema(
            OauthStateSchema,
          );
          const oauthState = yield* kvStore.get(`discord-${result.state}`).pipe(
            Effect.flatMap((state) =>
              Option.match(state, {
                onNone: () => new LoginTimeout(),
                onSome: (state) => Effect.succeed(state),
              }),
            ),
          );

          if (oauthState.state !== result.state) {
            return yield* new InvalidState();
          }

          const discord = yield* Discord.Service;
          const oAuth2Tokens = yield* discord.validateAuthorizationCode(
            result.code,
          );
          const accessToken = oAuth2Tokens.accessToken();
          const discordUser = yield* discord.getUserDetails(accessToken);
          yield* Effect.log("discordUser", discordUser);
          yield* Effect.log("oAuth2Tokens.data", oAuth2Tokens.data);

          const apiKeyService = yield* ApiKeyService;
          const apiKey = yield* apiKeyService.getApiKeyByPublicKeyWithProjectId(
            oauthState.publicKey,
          );

          const userService = yield* UserService;
          const authAccount = yield* userService.upsertAuthAccount({
            type: "discord",
            user: discordUser,
            projectId: apiKey.metadata.projectId,
          });

          // TODO: Set up the session

          yield* Effect.log("authAccount", authAccount);

          return { result: { accessToken }, status: 200 };
        });

      const { result, status } = await Effect.runPromise(
        handleRedirect(c.req.valid("query")).pipe(
          Effect.scoped,
          Effect.provide(FetchHttpClient.layer),
          Effect.provide(Discord.layer),
          Effect.provide(ApiKeyService.layer),
          Effect.provide(UserService.liveLayer),
          Effect.provide(CloudflareKvStore.ttlLayer),

          Effect.catchTags({
            oauth_failure: (e) => {
              return Effect.succeed({ result: e, status: 400 });
            },
            "@cubeflair/oauth/error/InvalidState": (e) => {
              return Effect.succeed({ result: e.message, status: 400 });
            },
            "@cubeflair/oauth/error/LoginTimeout": (e) => {
              return Effect.succeed({ result: e.message, status: 400 });
            },
            "@cubeflair/oauth/error/OauthRequestError": (e) => {
              return Effect.succeed({ result: e, status: 400 });
            },
          }),
          Effect.catchAllDefect((e) => {
            console.error(`Defect caught: ${e}`);
            return Effect.die(e);
          }),
          Effect.provide(
            pipe(
              c.env,
              Object.entries,
              (e) => new Map(e),
              (e) =>
                ConfigProvider.fromMap(e, {
                  pathDelim: "_",
                }),
              Layer.setConfigProvider,
            ),
          ),
        ),
      );

      return c.json(result, { status });
    },
  );
