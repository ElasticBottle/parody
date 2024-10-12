import type { HttpClientError } from "@effect/platform/HttpClientError";
import type { ParseError } from "@effect/schema/ParseResult";
import type { OAuth2Tokens } from "arctic";
import type { Effect } from "effect";
import type { OauthCodeValidationError } from "../errors";

export interface OauthService<A> {
  createAuthorizationUrl: (args: {
    state: string;
    codeVerifier: string;
    scopes?: Array<string>;
  }) => Effect.Effect<URL>;
  validateAuthorizationCode: (
    code: string,
  ) => Effect.Effect<OAuth2Tokens, OauthCodeValidationError>;
  getUserDetails: (
    accessToken: string,
  ) => Effect.Effect<A, ParseError | HttpClientError>;
}
