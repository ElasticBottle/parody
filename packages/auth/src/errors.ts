import { Schema } from "@effect/schema";
import type { UnknownException } from "effect/Cause";

export class NetworkError extends Schema.TaggedError<NetworkError>()(
  "@cubeflair/auth/error/NetworkError",
  {
    cause: Schema.instanceOf(Error),
  },
) {}

export class InvalidResponseError extends Schema.TaggedError<InvalidResponseError>()(
  "@cubeflair/auth/error/InvalidResponseError",
  {
    cause: Schema.instanceOf(Error),
  },
) {}

export class OauthRequestError extends Schema.TaggedError<OauthRequestError>()(
  "@cubeflair/auth/error/OauthRequestError",
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
  "@cubeflair/auth/error/LoginTimeout",
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => "Login Timeout. Please try logging in again.",
    }),
  },
) {}

export class InvalidState extends Schema.TaggedError<InvalidState>()(
  "@cubeflair/auth/error/InvalidState",
  {
    message: Schema.optionalWith(Schema.String, {
      default: () => "Invalid state, please try to login again.",
    }),
  },
) {}
