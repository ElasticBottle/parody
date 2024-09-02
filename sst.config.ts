/// <reference path="./.sst/platform/config.d.ts" />
import { readdirSync } from "node:fs";
export default $config({
	app(input) {
		let deployProfile = "parody-dev";
		if (input.stage === "production") {
			deployProfile = "parody-production";
		} else if (process.env.GITHUB_ACTIONS) {
			deployProfile = undefined;
		}
		console.log(
			"process.env.STRIPE_API_SECRET_KEY",
			process.env.STRIPE_API_SECRET_KEY,
		);
		return {
			name: "parody",
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
