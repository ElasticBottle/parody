import { HttpClient } from "@effect/platform";
import { GitHub } from "arctic";
import { Config, Effect, Layer, Redacted } from "effect";
import { validateAuthorizationCode } from "../../arctic/code-validation";
import { makeRedirectUrl } from "../../oauth/make-redirect-url";
import type { OauthService } from "../../oauth/service-interface";
import { GitHubUser, decodeGitHubUserResponseFromUnknown } from "./schema";

const githubProvider = Config.map(
  Config.all([
    Config.nested(
      Config.all([
        Config.string("CLIENT_ID"),
        Config.redacted("CLIENT_SECRET"),
      ]),
      "GITHUB",
    ),
    Config.string("BASE_URL"),
  ]),
  ([[clientId, clientSecret], baseUrl]) => {
    return new GitHub(
      clientId,
      Redacted.value(clientSecret),
      makeRedirectUrl({
        baseUrl,
        provider: "github",
      }),
    );
  },
);

export class Service extends Effect.Tag("@cubeflair/auth/github-service")<
  Service,
  OauthService<GitHubUser>
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const provider = yield* githubProvider;
    return {
      createAuthorizationUrl: ({
        state,
        scopes = ["read:user", "user:email"],
      }) => Effect.succeed(provider.createAuthorizationURL(state, scopes)),
      validateAuthorizationCode(code) {
        return validateAuthorizationCode(
          () => provider.validateAuthorizationCode(code),
          "github",
        );
      },
      getUserDetails: (accessToken: string) =>
        Effect.gen(function* () {
          const client = yield* HttpClient.HttpClient;
          const response = yield* client.get("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const json = yield* response.json;
          const gitHubUserResponse =
            yield* decodeGitHubUserResponseFromUnknown(json);

          const emailResponse = yield* client.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          const emailJson = yield* emailResponse.json;
          yield* Effect.log(emailJson);

          return new GitHubUser({
            id: gitHubUserResponse.id.toString(),
            login: gitHubUserResponse.login,
            nodeId: gitHubUserResponse.node_id,
            pictureUrl: gitHubUserResponse.avatar_url,
            name: gitHubUserResponse.name,
            blog: gitHubUserResponse.blog,
            company: gitHubUserResponse.company,
            email: gitHubUserResponse.email,
            location: gitHubUserResponse.location,
          });
        }).pipe(Effect.withSpan("@cubeflair/github-service/getUserDetails")),
    };
  }),
);
