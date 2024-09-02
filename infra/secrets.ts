export const secret = {
	StripeSecret: new sst.Secret("StripeSecret", process.env.STRIPE_API_KEY),
	StripePublic: new sst.Secret("StripePublic", process.env.STRIPE_PUBLIC_KEY),
};

export const allSecrets = Object.values(secret);
