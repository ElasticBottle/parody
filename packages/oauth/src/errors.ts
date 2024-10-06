import { Schema } from "@effect/schema";
import type { UnknownException } from "effect/Cause";

export class GenerateStateError extends Schema.TaggedError<GenerateStateError>()(
  "GenerateStateError",
  {
    message: Schema.String,
  },
) {}

export class GenerateCodeVerifierError extends Schema.TaggedError<GenerateCodeVerifierError>()(
  "GenerateCodeVerifierError",
  {
    message: Schema.String,
  },
) {}

export class NetworkError extends Schema.TaggedError<NetworkError>()(
  "@cubeflair/oauth/error/NetworkError",
  {
    cause: Schema.instanceOf(Error),
  },
) {}

export class InvalidResponseError extends Schema.TaggedError<InvalidResponseError>()(
  "@cubeflair/oauth/error/InvalidResponseError",
  {
    cause: Schema.instanceOf(Error),
  },
) {}

export class OauthRequestError extends Schema.TaggedError<OauthRequestError>()(
  "@cubeflair/oauth/error/OauthRequestError",
  {
    message: Schema.String,
    name: Schema.String,
    code: Schema.String,
    description: Schema.optionalWith(Schema.String, { nullable: true }),
    uri: Schema.optionalWith(Schema.String, { nullable: true }),
    state: Schema.optionalWith(Schema.String, { nullable: true }),
    cause: Schema.instanceOf(Error),
  },
) {}
export type OauthCodeValidationError =
  | NetworkError
  | InvalidResponseError
  | OauthRequestError
  | UnknownException;

export class LoginTimeout extends Schema.TaggedError<LoginTimeout>()(
  "@cubeflair/oauth/error/LoginTimeout",
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => "Login Timeout. Please try logging in again.",
    }),
  },
) {}

export class InvalidState extends Schema.TaggedError<InvalidState>()(
  "@cubeflair/oauth/error/InvalidState",
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => "Invalid state, please try to login again.",
    }),
  },
) {}
