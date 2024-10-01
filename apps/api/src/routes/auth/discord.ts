import type { Schema } from "@effect/schema";
import { effectValidator } from "@hono/effect-validator";
import { ConfigProvider, Effect, Layer, Option } from "effect";
import { Hono } from "hono";
import * as DiscordProvider from "~/lib/auth/discord/config";
import { InvalidState, LoginTimeout } from "~/lib/auth/errors";
import { CloudflareKvStore } from "~/services/kv-store";
import { OauthStateGenerator } from "../../lib/auth/ouath-state-generator";
import {
  DiscordOauthCallbackSchema,
  OauthInputSchema,
  OauthStateSchema,
} from "../../lib/auth/schema";
import type { Env } from "../../lib/env";
export const discordRouter = new Hono<{
  Bindings: Env;
}>();

const redirectUrl = `${"https://parody-elasticbottle-apiscript.winstonyeo99.workers.dev"}/login/discord/callback`;

discordRouter
  .get("/", effectValidator("query", OauthInputSchema), async (c) => {
    const getAuthorizationUrl = (redirectUrl: string, publicKey: string) => {
      return Effect.gen(function* () {
        const kvStore = (yield* CloudflareKvStore).forSchema(OauthStateSchema);
        const stateGenerator = yield* OauthStateGenerator;
        const discord = yield* DiscordProvider.config(redirectUrl);

        const state = yield* stateGenerator.generateState;
        yield* kvStore.setTtl(
          `discord-${state}`,
          {
            publicKey,
            redirectUrl,
            state,
          },
          15 * 60, // 15 minutes
        );

        const url = yield* discord.createAuthorizationUrl(state);
        return url;
      });
    };

    const url = await Effect.runPromise(
      getAuthorizationUrl(redirectUrl, c.req.valid("query").publicKey).pipe(
        Effect.provide(
          Layer.setConfigProvider(
            ConfigProvider.fromMap(new Map(Object.entries(c.env)), {
              pathDelim: "_",
            }),
          ),
        ),
        Effect.provide(CloudflareKvStore.withTtlLayerLive),
        Effect.provide(OauthStateGenerator.nodeLive),
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
          const discord = yield* DiscordProvider.config(redirectUrl);
          if (result.status === "error") {
            return yield* Effect.fail({
              ...result,
              _tag: "oauth_failure" as const,
            });
          }

          const kvStore = (yield* CloudflareKvStore).forSchema(
            OauthStateSchema,
          );

          const oauthStateOption = yield* kvStore.get(
            `discord-${result.state}`,
          );

          const oauthState = yield* Option.match(oauthStateOption, {
            onNone: () => new LoginTimeout(),
            onSome: (state) => Effect.succeed(state),
          });

          if (oauthState.state !== result.state) {
            return yield* new InvalidState();
          }

          const oAuth2Tokens = yield* discord.validateAuthorizationCode(
            result.code,
          );
          const accessToken = oAuth2Tokens.accessToken();
          return { result: { accessToken }, status: 200 };
        });

      const { result, status } = await Effect.runPromise(
        handleRedirect(c.req.valid("query")).pipe(
          Effect.provide(
            Layer.setConfigProvider(
              ConfigProvider.fromMap(new Map(Object.entries(c.env)), {
                pathDelim: "_",
              }),
            ),
          ),
          Effect.provide(CloudflareKvStore.withTtlLayerLive),
          Effect.catchTags({
            oauth_failure: (e) => {
              return Effect.succeed({ result: e, status: 400 });
            },
            "auth.errors.InvalidState": (e) => {
              return Effect.succeed({ result: e.message, status: 400 });
            },
            "auth.errors.LoginTimeout": (e) => {
              return Effect.succeed({ result: e.message, status: 400 });
            },
            "arctic.OauthRequestInvalidResponseError": (e) => {
              return Effect.succeed({ result: e, status: 400 });
            },
            "arctic.OauthRequestError": (e) => {
              return Effect.succeed({ result: e, status: 400 });
            },
          }),
        ),
      );

      return c.json(result, { status });
    },
  );
