import { Schema } from "@effect/schema";

export const OauthSuccessSchema = Schema.Struct({
	code: Schema.String.pipe(Schema.nonEmptyString()),
	state: Schema.String.pipe(Schema.nonEmptyString()),
	status: Schema.optionalWith(Schema.Literal("success"), {
		default: () => "success",
	}),
});
export const decodeOauthSuccessFromUnknownEither =
	Schema.decodeUnknownEither(OauthSuccessSchema);

export const DiscordOauthErrorSchema = Schema.Struct({
	error: Schema.String.pipe(Schema.nonEmptyString()),
	error_description: Schema.String.pipe(Schema.nonEmptyString()),
	status: Schema.optionalWith(Schema.Literal("error"), {
		default: () => "error",
	}),
});
export const decodeDiscordOauthErrorFromUnknownEither =
	Schema.decodeUnknownEither(DiscordOauthErrorSchema);

export const DiscordOauthCallbackSchema = Schema.Union(
	DiscordOauthErrorSchema,
	OauthSuccessSchema,
);
