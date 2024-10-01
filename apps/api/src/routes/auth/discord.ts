import { effectValidator } from "@hono/effect-validator";
import { Discord, OAuth2RequestError } from "arctic";
import { ConfigProvider, Effect, Layer } from "effect";
import { Hono } from "hono";
import { Resource } from "sst";
import * as DiscordProvider from "~/lib/auth/discord/config";
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
          5 * 60, // 5 seconds
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
      const result = c.req.valid("query");
      if (result.status === "error") {
        return c.json(result);
      }

      const discord = new Discord(
        c.env.DISCORD_CLIENT_ID,
        c.env.DISCORD_CLIENT_SECRET,
        redirectUrl,
      );

      const { state: existingState } = JSON.parse(
        (await Resource.KvStore.get(`discord-${result.state}`)) ?? "",
      );
      if (!existingState || existingState !== result.state) {
        return c.json({ message: "Invalid state" }, 400);
      }

      try {
        const { accessToken, accessTokenExpiresAt, refreshToken } =
          await discord.validateAuthorizationCode(result.code);
        console.log(
          "accessToken, accessTokenExpiresAt,refreshToken",
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
        );
      } catch (e) {
        if (e instanceof OAuth2RequestError) {
          if (e.message === "invalid_grant") {
            return c.json(
              { message: "Invalid grant. Please try logging in again." },
              400,
            );
          }
          return c.json({ message: "Unknown error" }, 500);
        }
        throw e;
      }

      return c.json({ message: "Hello Cloudflare Workers!" });
    },
  );
