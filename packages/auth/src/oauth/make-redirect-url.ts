import type { SupportedOauthProviders } from "../supported-oauth";

export const makeRedirectUrl = ({
  provider,
  baseUrl,
}: { provider: SupportedOauthProviders; baseUrl: string }) => {
  return `${baseUrl}/login/${provider}/callback`;
};
