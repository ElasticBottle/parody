import { Schema } from "@effect/schema";

const EnvSchema = Schema.Struct({
  DISCORD_CLIENT_ID: Schema.String.pipe(Schema.nonEmptyString()),
  DISCORD_CLIENT_SECRET: Schema.String.pipe(Schema.nonEmptyString()),
  GITHUB_CLIENT_ID: Schema.String.pipe(Schema.nonEmptyString()),
  GITHUB_CLIENT_SECRET: Schema.String.pipe(Schema.nonEmptyString()),
});

export interface Env extends Schema.Schema.Type<typeof EnvSchema> {}

export const decodeApiEnvFromUnknown = Schema.decodeUnknownSync(EnvSchema);
