import { Hono } from "hono";
import { discordRouter } from "./discord";
import { githubRouter } from "./github";

export const authRouter = new Hono();
authRouter.route("/discord", discordRouter);
authRouter.route("/github", githubRouter);
