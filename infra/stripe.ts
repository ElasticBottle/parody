import { domain } from "./dns";

sst.Linkable.wrap(stripe.Product, (product) => {
	return {
		properties: {
			id: product.id,
			productId: product.productId,
		},
	};
});

export const stripeProduct = new stripe.Product("StripeProduct", {
	active: true,
	name: "AI Product Shot",
	description: "Professional AI Product Shots of your product",
	statementDescriptor: "AI Product shots",
	unitLabel: "photo",
	shippable: false,
});

sst.Linkable.wrap(stripe.Price, (price) => {
	return {
		properties: {
			id: price.id,
			lookupKey: price.lookupKey,
		},
	};
});

export const stripePrice = new stripe.Price("StripePrice", {
	active: true,
	product: stripeProduct.id,
	currency: "usd",
	unitAmount: 3500,
});

sst.Linkable.wrap(stripe.WebhookEndpoint, (endpoint) => {
	return {
		properties: {
			id: endpoint.id,
			secret: endpoint.secret,
		},
	};
});

export const stripeWebhook = new stripe.WebhookEndpoint(
	"StripeWebhook",
	{
		url: $interpolate`${domain}/hook/stripe`,
		metadata: {
			stage: $app.stage,
		},
		enabledEvents: [
			"payment_method.attached",
			"payment_method.detached",
			"payment_method.updated",
			"product.created",
			"product.updated",
			"product.deleted",
			"price.created",
			"price.updated",
			"price.deleted",
		],
	},
	{},
);
