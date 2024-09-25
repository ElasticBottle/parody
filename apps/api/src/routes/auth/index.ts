import { Hono } from "hono";
import { discordRouter } from "./discord";

export const authRouter = new Hono();
authRouter.route("/discord", discordRouter);
