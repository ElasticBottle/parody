import { Schema } from "@effect/schema";

export const SUPPORTED_OAUTH_PROVIDERS = [
  "github",
  "discord",
  "google",
] as const;

export const SupportedOauthProvidersSchema = Schema.Union(
  ...SUPPORTED_OAUTH_PROVIDERS.map((provider) => Schema.Literal(provider)),
);
export type SupportedOauthProviders = Schema.Schema.Type<
  typeof SupportedOauthProvidersSchema
>;
