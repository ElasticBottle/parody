import { HttpClient } from "@effect/platform";
import { Discord } from "arctic";
import { Config, Effect, Layer, Redacted } from "effect";
import { validateAuthorizationCode } from "../../arctic/code-validation";
import { makeRedirectUrl } from "../../oauth/make-redirect-url";
import type { OauthService } from "../../oauth/service-interface";
import { DiscordUser, decodeDiscordUserResponseFromUnknown } from "./schema";

const discordProvider = Config.map(
  Config.all([
    Config.nested(
      Config.all([
        Config.string("CLIENT_ID"),
        Config.redacted("CLIENT_SECRET"),
      ]),
      "DISCORD",
    ),
    Config.string("BASE_URL"),
  ]),
  ([[clientId, clientSecret], baseUrl]) => {
    return new Discord(
      clientId,
      Redacted.value(clientSecret),
      makeRedirectUrl({
        baseUrl,
        provider: "discord",
      }),
    );
  },
);

export class Service extends Effect.Tag("@cubeflair/oauth/discord-service")<
  Service,
  OauthService<DiscordUser>
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const provider = yield* discordProvider;
    return {
      createAuthorizationUrl: ({ state, scopes = ["identify", "email"] }) =>
        Effect.succeed(provider.createAuthorizationURL(state, scopes)),
      validateAuthorizationCode(code) {
        return validateAuthorizationCode(
          () => provider.validateAuthorizationCode(code),
          "discord",
        );
      },
      getUserDetails: (accessToken: string) =>
        Effect.gen(function* () {
          const client = yield* HttpClient.HttpClient;
          const response = yield* client.get(
            "https://discord.com/api/v10/users/@me",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const json = yield* response.json;
          const discordUserResponse =
            yield* decodeDiscordUserResponseFromUnknown(json);
          return new DiscordUser({
            id: discordUserResponse.id,
            username: discordUserResponse.username,
            discordTag: discordUserResponse.discriminator,
            displayName: discordUserResponse.global_name,
            email: discordUserResponse.email,
            emailVerified: discordUserResponse.verified,
            locale: discordUserResponse.locale,
            pictureUrl: `https://cdn.discordapp.com/avatars/${discordUserResponse.id}/${discordUserResponse.avatar}.png`,
            system: discordUserResponse.system,
            bot: discordUserResponse.bot,
          });
        }).pipe(Effect.withSpan("@cubeflair/discord-service/getUserDetails")),
    };
  }),
);
