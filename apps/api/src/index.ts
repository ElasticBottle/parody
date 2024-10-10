import { OTLPExporter, instrument } from "@microlabs/otel-cf-workers";
import { Hono } from "hono";
import type { Env } from "./lib/env";
import { authRouter } from "./routes/auth";

const app = new Hono<{ Bindings: Env }>();
app.get("/", (c) => c.text("Hello Workers!"));

app.route("/login", authRouter);

export default instrument(app, (env: Env) => {
  return {
    exporter: new OTLPExporter({
      url: env.OTEL_URL,
      headers: {
        "X-Honeycomb-Team": env.OTEL_SECRET_KEY,
      },
    }),
    service: {
      name: env.OTEL_SERVICE_NAME,
    },
  };
});
