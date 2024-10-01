import { effectValidator } from "@hono/effect-validator";
import { GitHub, OAuth2RequestError, generateState } from "arctic";
import { Hono } from "hono";
import { Resource } from "sst";
import { GithubOauthCallbackSchema } from "../../lib/auth/schema";
import type { Env } from "../../lib/env";

export const githubRouter = new Hono<{
  Bindings: Env;
}>();

githubRouter
  .get("/", async (c) => {
    const github = new GitHub(
      c.env.GITHUB_CLIENT_ID,
      c.env.GITHUB_CLIENT_SECRET,
    );

    const state = generateState();
    console.log("state", state);
    await Resource.KvStore.put(`github-${state}`, JSON.stringify({ state }), {
      expirationTtl: 60 * 15, // 15 minutes
    });
    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
    const authorizationURL = await github.createAuthorizationURL(state, {
      scopes: [],
    });

    return c.redirect(authorizationURL.href);
  })

  .get(
    "/callback",
    effectValidator("query", GithubOauthCallbackSchema),
    async (c) => {
      const result = c.req.valid("query");
      if (result.status === "error") {
        return c.json(result);
      }

      const github = new GitHub(
        c.env.GITHUB_CLIENT_ID,
        c.env.GITHUB_CLIENT_SECRET,
      );

      const { state: existingState } = JSON.parse(
        (await Resource.KvStore.get(`github-${result.state}`)) ??
          '{ state: "" }',
      ) as { state: string };
      if (!existingState || existingState !== result.state) {
        console.log("existingState", existingState);
        return c.json({ message: "Invalid state" }, 400);
      }

      try {
        const { accessToken } = await github.validateAuthorizationCode(
          result.code,
        );
        console.log("accessToken", accessToken);
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
