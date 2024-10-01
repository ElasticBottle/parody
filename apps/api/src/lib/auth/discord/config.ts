import { Discord } from "arctic";
import { Config, Effect, Redacted } from "effect";
import { validateAuthorizationCode } from "../arctic-wrapper";

export class DiscordProvider {
  provider: Discord;
  constructor(
    readonly clientId: string,
    readonly clientSecret: string,
    readonly redirectUrl: string,
  ) {
    this.provider = new Discord(clientId, clientSecret, redirectUrl);
  }

  createAuthorizationUrl(state: string, scopes = ["email", "openid"]) {
    return Effect.succeed(this.provider.createAuthorizationURL(state, scopes));
  }

  async validateAuthorizationCode(code: string) {
    return validateAuthorizationCode(
      () => this.provider.validateAuthorizationCode(code),
      "discord",
    );
  }
}

export const config = (redirectUrl: string) =>
  Config.map(
    Config.nested(
      Config.all([
        Config.string("CLIENT_ID"),
        Config.redacted("CLIENT_SECRET"),
      ]),
      "DISCORD",
    ),
    ([clientId, clientSecret]) =>
      new DiscordProvider(clientId, Redacted.value(clientSecret), redirectUrl),
  );
