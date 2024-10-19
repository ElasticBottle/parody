import { decodeApiEnvFromUnknownSync } from "../apps/api/src/lib/env";
import { domain } from "./dns";
import { kv } from "./kv";
import { bucket } from "./storage";

export const api = new sst.cloudflare.Worker("Api", {
  url: true,
  handler: "./apps/api/src/index.ts",
  link: [kv, bucket],
  environment: decodeApiEnvFromUnknownSync({
    ...process.env,
    BASE_URL: $interpolate`${domain}`,
  }),
});

export const outputs = {
  api: api.url,
};
