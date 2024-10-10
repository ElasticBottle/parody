import type { HttpClientError } from "@effect/platform/HttpClientError";
import type { ParseError } from "@effect/schema/ParseResult";
import type { OAuth2Tokens } from "arctic";
import type { Effect } from "effect";
import type { Scope } from "effect/Scope";

import type { HttpClient } from "@effect/platform/HttpClient";
import type { OauthCodeValidationError } from "../errors";

export interface OauthService<A> {
  createAuthorizationUrl: (args: {
    state: string;
    codeVerifier: string;
    scopes?: Array<string>;
  }) => Effect.Effect<URL, never, never>;
  validateAuthorizationCode: (
    code: string,
  ) => Effect.Effect<OAuth2Tokens, OauthCodeValidationError, never>;
  getUserDetails: (
    accessToken: string,
  ) => Effect.Effect<A, ParseError | HttpClientError, Scope | HttpClient>;
}
