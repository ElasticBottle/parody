import { Hono } from "hono";
import { authRouter } from "./routes/auth";

const app = new Hono();
app.get("/", (c) => c.text("Hello Cloudflare Workers!"));

app.route("/login", authRouter);

export default app;
