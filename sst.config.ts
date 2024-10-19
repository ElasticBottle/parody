/// <reference path="./.sst/platform/config.d.ts" />
import { readdirSync } from "node:fs";

export default $config({
  app(input) {
    let deployProfile = "rectangular-labs-dev";
    if (input.stage === "production") {
      deployProfile = "rectangular-labs-production";
    }

    return {
      name: "rectangular-labs",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "cloudflare",
      providers: {
        aws: {
          region: "us-west-2",
          profile: deployProfile,
        },
        "pulumi-stripe": true,
        cloudflare: true,
      },
    };
  },
  async run() {
    const outputs = {};
    for (const value of readdirSync("./infra/")) {
      const result = await import(`./infra/${value}`);
      if (result.outputs) Object.assign(outputs, result.outputs);
    }
    return outputs;
  },
});
