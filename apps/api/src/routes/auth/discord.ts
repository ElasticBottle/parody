import { effectValidator } from "@hono/effect-validator";
import { Discord, OAuth2RequestError, generateState } from "arctic";
import { Hono } from "hono";
import { Resource } from "sst";
import type { Env } from "../../lib/env";
import { DiscordOauthCallbackSchema } from "../../lib/schema/oauth-callback";

export const discordRouter = new Hono<{
	Bindings: Env;
}>();

const redirectUrl = `${"https://parody-elasticbottle-apiscript.winstonyeo99.workers.dev"}/login/discord/callback`;

discordRouter
	.get("/", async (c) => {
		const discord = new Discord(
			c.env.DISCORD_CLIENT_ID,
			c.env.DISCORD_CLIENT_SECRET,
			redirectUrl,
		);

		const state = generateState();
		await Resource.KvStore.put(`discord-${state}`, JSON.stringify({ state }), {
			expirationTtl: 60 * 15, // 15 minutes
		});
		// https://discord.com/developers/docs/topics/oauth2
		const authorizationURL = await discord.createAuthorizationURL(state, {
			scopes: ["email", "openid"],
		});

		return c.redirect(authorizationURL.href);
	})

	.get(
		"/callback",
		effectValidator("query", DiscordOauthCallbackSchema),
		async (c) => {
			const result = c.req.valid("query");
			if (result.status === "error") {
				return c.json(result);
			}

			const discord = new Discord(
				c.env.DISCORD_CLIENT_ID,
				c.env.DISCORD_CLIENT_SECRET,
				redirectUrl,
			);

			const { state: existingState } = JSON.parse(
				(await Resource.KvStore.get(`discord-${result.state}`)) ?? "",
			);
			if (!existingState || existingState !== result.state) {
				return c.json({ message: "Invalid state" }, 400);
			}

			try {
				const { accessToken, accessTokenExpiresAt, refreshToken } =
					await discord.validateAuthorizationCode(result.code);
				console.log(
					"accessToken, accessTokenExpiresAt,refreshToken",
					accessToken,
					accessTokenExpiresAt,
					refreshToken,
				);
			} catch (e) {
				if (e instanceof OAuth2RequestError) {
					if (e.message === "invalid_grant") {
						return c.json(
							{ message: "Invalid grant. Please try logging in again." },
							400,
						);
					}
					return c.json({ message: "Unknown error" }, 500);
				}
				throw e;
			}

			return c.json({ message: "Hello Cloudflare Workers!" });
		},
	);
