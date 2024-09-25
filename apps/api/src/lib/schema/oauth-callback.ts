import { Schema } from "@effect/schema";

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

export const DiscordOauthCallbackSchema = Schema.Union(
	DiscordOauthErrorSchema,
	OauthSuccessSchema,
);

export const GithubOauthCallbackSchema = Schema.Union(
	GithubOauthErrorSchema,
	OauthSuccessSchema,
);
