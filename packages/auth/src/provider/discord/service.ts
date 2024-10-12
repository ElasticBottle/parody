import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Discord } from "arctic";
import { Config, Effect, Layer, Redacted } from "effect";
import { validateAuthorizationCode } from "../../arctic/code-validation";
import { makeRedirectUrl } from "../../oauth/make-redirect-url";
import type { OauthService } from "../../oauth/service-interface";
import { DiscordUser, DiscordUserResponse } from "./schema";

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

export class Service extends Effect.Tag("@cubeflair/auth/discord-service")<
  Service,
  OauthService<DiscordUser>
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const provider = yield* discordProvider;
    return {
      createAuthorizationUrl: ({ state, scopes = ["identify", "email"] }) =>
        Effect.succeed(provider.createAuthorizationURL(state, scopes)).pipe(
          Effect.withSpan("@cubeflair/discord-service/createAuthorizationUrl"),
        ),
      validateAuthorizationCode: (code) => {
        return validateAuthorizationCode(
          () => provider.validateAuthorizationCode(code),
          "discord",
        );
      },
      getUserDetails: (accessToken: string) =>
        Effect.gen(function* () {
          const client = (yield* HttpClient.HttpClient).pipe(
            HttpClient.filterStatusOk,
          );
          const req = HttpClientRequest.get(
            "https://discord.com/api/v10/users/@me",
          ).pipe(HttpClientRequest.bearerToken(accessToken));

          const response = yield* client.execute(req);

          const discordUserResponse =
            yield* HttpClientResponse.schemaBodyJson(DiscordUserResponse)(
              response,
            );

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
        }).pipe(
          Effect.scoped,
          Effect.provide(FetchHttpClient.layer),
          Effect.withSpan("@cubeflair/discord-service/getUserDetails"),
        ),
    };
  }),
);
