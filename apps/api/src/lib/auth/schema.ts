import { Schema } from "@effect/schema";

export const OauthInputSchema = Schema.Struct({
  redirectUrl: Schema.String.pipe(Schema.nonEmptyString()),
  publicKey: Schema.String.pipe(
    Schema.nonEmptyString(),
    Schema.startsWith("public_key_"),
  ),
});

export const OauthStateSchema = Schema.Struct({
  state: Schema.String.pipe(Schema.nonEmptyString()),
  redirectUrl: Schema.String.pipe(Schema.nonEmptyString()),
  publicKey: Schema.String.pipe(
    Schema.nonEmptyString(),
    Schema.startsWith("public_key_"),
  ),
});

// OAUTH CALLBACK SUCCESS
const OauthSuccessSchema = Schema.Struct({
  code: Schema.String.pipe(Schema.nonEmptyString()),
  state: Schema.String.pipe(Schema.nonEmptyString()),
  status: Schema.optionalWith(Schema.Literal("success"), {
    default: () => "success",
  }),
});

// OAUTH CALLBACK ERRORS
const OauthErrorSchemaFields = {
  error: Schema.String.pipe(Schema.nonEmptyString()),
  status: Schema.optionalWith(Schema.Literal("error"), {
    default: () => "error",
  }),
};

const DiscordOauthErrorSchema = Schema.Struct({
  error_description: Schema.String.pipe(Schema.nonEmptyString()),
  ...OauthErrorSchemaFields,
});

const GithubOauthErrorSchema = Schema.Struct({
  error_description: Schema.String.pipe(Schema.nonEmptyString()),
  error_uri: Schema.String.pipe(Schema.nonEmptyString()),
  state: Schema.String.pipe(Schema.nonEmptyString()),
  ...OauthErrorSchemaFields,
});

//  CALLBACK SCHEMAS
export const DiscordOauthCallbackSchema = Schema.Union(
  DiscordOauthErrorSchema,
  OauthSuccessSchema,
);

export const GithubOauthCallbackSchema = Schema.Union(
  GithubOauthErrorSchema,
  OauthSuccessSchema,
);
