export const www = new sst.cloudflare.StaticSite("WWW", {
	path: "./apps/www",
	build: {
		command: "bun run build",
		output: "dist",
	},
});

export const outputs = {
	www: www.url,
};
