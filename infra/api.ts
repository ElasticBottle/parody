import { bucket } from "./storage";
import { stripeWebhook } from "./stripe";

export const api = new sst.cloudflare.Worker("Api", {
	url: true,
	handler: "./packages/api/src/index.ts",
	link: [bucket, stripeWebhook],
});

export const outputs = {
	api: api.url,
};
