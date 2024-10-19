import { OTLPExporter, instrument } from "@microlabs/otel-cf-workers";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { Hono } from "hono";
import type { Env } from "./lib/env";
import { authRouter } from "./routes/auth";

const app = new Hono<{ Bindings: Env }>();
app.get("/", (c) => c.text("Hello Workers!"));

app.route("/login", authRouter);

export default instrument(app, (env: Env, trigger) => {
  // We only want otel for request hitting our API routes
  if (trigger instanceof Request) {
    const url = new URL(trigger.url);
    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/api")) {
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
    }
  }
  // everything else can be ignore (favicon etc.)
  return {
    exporter: new ConsoleSpanExporter(),
    service: {
      name: env.OTEL_SERVICE_NAME,
    },
  };
});
