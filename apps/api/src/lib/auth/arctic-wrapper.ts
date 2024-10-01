import {
  ArcticFetchError,
  OAuth2RequestError,
  type OAuth2Tokens,
} from "arctic";
import { Data, Effect } from "effect";
import { UnknownException } from "effect/Cause";

export class OauthFetchError extends Data.TaggedError(
  "arctic.OauthFetchError",
)<{
  message: string;
  name: string;
}> {}

export class OauthRequestInvalidResponseError extends Data.TaggedError(
  "arctic.OauthRequestInvalidResponseError",
)<{
  message: string;
  name: string;
}> {}
export class OauthRequestError extends Data.TaggedError(
  "arctic.OauthRequestError",
)<{
  message: string;
  name: string;
  code: string;
  description: string | null;
  uri: string | null;
  state: string | null;
}> {}

export class OauthValidateCodeFailed extends Data.TaggedError(
  "arctic.OauthValidateCodeFailed",
)<{
  message: string;
}> {}

export const validateAuthorizationCode = (
  codeValidator: () => Promise<OAuth2Tokens>,
  providerName: "discord" | "github" | "google" | "facebook",
) => {
  return Effect.tryPromise({
    try: codeValidator,
    catch: (e) => {
      if (e instanceof ArcticFetchError) {
        return new OauthFetchError({ message: e.message, name: e.name });
      }
      if (e instanceof Error) {
        return new OauthRequestInvalidResponseError({
          message: e.message,
          name: e.name,
        });
      }
      if (e instanceof OAuth2RequestError) {
        return new OauthRequestError({
          message: e.message,
          name: e.name,
          code: e.code,
          description: e.description,
          uri: e.uri,
          state: e.state,
        });
      }
      return new UnknownException(e);
    },
  }).pipe(Effect.withSpan(`validateAuthorizationCode.${providerName}`));
};
