import {
  ArcticFetchError,
  OAuth2RequestError,
  type OAuth2Tokens,
} from "arctic";
import { Effect } from "effect";
import { UnknownException } from "effect/Cause";
import {
  InvalidResponseError,
  NetworkError,
  OauthRequestError,
} from "../errors";
import type { SupportedOauthProviders } from "../supported-oauth";

export type OauthValidateCodeError =
  | NetworkError
  | InvalidResponseError
  | OauthRequestError
  | UnknownException;

export const validateAuthorizationCode = (
  codeValidator: () => Promise<OAuth2Tokens>,
  providerName: SupportedOauthProviders,
): Effect.Effect<OAuth2Tokens, OauthValidateCodeError> => {
  return Effect.tryPromise({
    try: codeValidator,
    catch: (e) => {
      if (e instanceof ArcticFetchError) {
        return new NetworkError({ cause: e });
      }
      if (e instanceof OAuth2RequestError) {
        return new OauthRequestError({
          cause: e,
          message: e.message,
          name: e.name,
          code: e.code,
          description: e.description ?? undefined,
          uri: e.uri ?? undefined,
          state: e.state ?? undefined,
        });
      }
      if (e instanceof Error) {
        return new InvalidResponseError({
          cause: e,
        });
      }
      return new UnknownException(
        e,
        "Unknown error while validating oauth code",
      );
    },
  }).pipe(
    Effect.withSpan(
      `@cubeflair/oauth/validateAuthorizationCode/${providerName}`,
    ),
  );
};
